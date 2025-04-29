import os
import io
import torch
import base64
from PIL import Image
from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
import torchvision.transforms as transforms


class ResnetBlock(torch.nn.Module):
    def __init__(self, channels):
        super(ResnetBlock, self).__init__()
        self.conv_block = torch.nn.Sequential(
            torch.nn.Conv2d(channels, channels, kernel_size=3, stride=1, padding=1),
            torch.nn.InstanceNorm2d(channels),
            torch.nn.ReLU(inplace=True),
            torch.nn.Conv2d(channels, channels, kernel_size=3, stride=1, padding=1),
            torch.nn.InstanceNorm2d(channels),
        )

    def forward(self, x):
        return x + self.conv_block(x)


class Generator(torch.nn.Module):
    def __init__(self, input_channels=1, output_channels=1, num_res_blocks=9):
        super(Generator, self).__init__()
        model = [
            torch.nn.Conv2d(input_channels, 64, kernel_size=7, stride=1, padding=3),
            torch.nn.InstanceNorm2d(64),
            torch.nn.ReLU(inplace=True),
        ]

        in_channels = 64
        out_channels = 128

        for _ in range(2):
            model += [
                torch.nn.Conv2d(
                    in_channels, out_channels, kernel_size=3, stride=2, padding=1
                ),
                torch.nn.InstanceNorm2d(out_channels),
                torch.nn.ReLU(inplace=True),
            ]
            in_channels = out_channels
            out_channels *= 2

        for _ in range(num_res_blocks):
            model += [ResnetBlock(in_channels)]

        out_channels = in_channels // 2
        for _ in range(2):
            model += [
                torch.nn.ConvTranspose2d(
                    in_channels,
                    out_channels,
                    kernel_size=3,
                    stride=2,
                    padding=1,
                    output_padding=1,
                ),
                torch.nn.InstanceNorm2d(out_channels),
                torch.nn.ReLU(inplace=True),
            ]
            in_channels = out_channels
            out_channels //= 2

        model += [
            torch.nn.Conv2d(
                in_channels, output_channels, kernel_size=7, stride=1, padding=3
            ),
            torch.nn.Tanh(),
        ]

        self.model = torch.nn.Sequential(*model)

    def forward(self, x):
        return self.model(x)


app = FastAPI(title="Chest X-ray Image Translation API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

G_AB = None
G_BA = None
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

MODEL_DIR = "../checkpoints"
G_AB_PATH = os.path.join(MODEL_DIR, "G_AB_90.pth")
G_BA_PATH = os.path.join(MODEL_DIR, "G_BA_90.pth")


@app.on_event("startup")
async def startup_event():
    global G_AB, G_BA

    if not os.path.exists(MODEL_DIR):
        os.makedirs(MODEL_DIR, exist_ok=True)

    try:
        G_AB = Generator().to(device)
        G_BA = Generator().to(device)

        if os.path.exists(G_AB_PATH):
            G_AB.load_state_dict(torch.load(G_AB_PATH, map_location=device))
            G_AB.eval()
            print(f"Loaded G_AB model from {G_AB_PATH}")
        else:
            print(f"Warning: G_AB model not found at {G_AB_PATH}")

        if os.path.exists(G_BA_PATH):
            G_BA.load_state_dict(torch.load(G_BA_PATH, map_location=device))
            G_BA.eval()
            print(f"Loaded G_BA model from {G_BA_PATH}")
        else:
            print(f"Warning: G_BA model not found at {G_BA_PATH}")

        print(f"Models initialized on {device}")

    except Exception as e:
        print(f"Error loading models: {str(e)}")


def preprocess_image(image):
    transform = transforms.Compose(
        [
            transforms.Grayscale(num_output_channels=1),
            transforms.Resize((256, 256)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.5], std=[0.5]),
        ]
    )
    return transform(image).unsqueeze(0).to(device)


def generate_from_image(image, generator):
    input_tensor = preprocess_image(image)

    with torch.no_grad():
        output_tensor = generator(input_tensor)

    output_tensor = output_tensor.squeeze(0).cpu()
    output_tensor = (output_tensor * 0.5) + 0.5

    to_pil = transforms.ToPILImage()
    return to_pil(output_tensor)


@app.get("/")
def read_root():
    return {"message": "Chest X-ray Translation API", "status": "running"}


@app.post("/translate")
async def translate_image(
    file: UploadFile = File(...), translation_type: str = Form(...)
):
    global G_AB, G_BA

    if G_AB is None or G_BA is None:
        raise HTTPException(status_code=503, detail="Models not loaded yet")

    if translation_type not in ["normal_to_pneumonia", "pneumonia_to_normal"]:
        raise HTTPException(status_code=400, detail="Invalid translation type")

    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))

        if translation_type == "normal_to_pneumonia":
            generator = G_AB
            source_type = "normal"
            target_type = "pneumonia"
        else:
            generator = G_BA
            source_type = "pneumonia"
            target_type = "normal"

        translated_image = generate_from_image(image, generator)

        img_bytes = io.BytesIO()
        translated_image.save(img_bytes, format="PNG")
        img_bytes.seek(0)

        return {
            "message": f"Translated {source_type} to {target_type}",
            "image_data": base64.b64encode(img_bytes.getvalue()).decode(),
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")