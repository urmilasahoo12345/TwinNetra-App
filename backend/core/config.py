from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    SECRET_KEY: str = "dev-secret-change-me"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    # 👇 ADDED : str right here
    OPEN_METEO_BASE_URL: str = "https://api.open-meteo.com/v1/forecast"
    DATA_FILE: str = "twinnetra_climate_2024.csv"
    MOSDAC_FILE: str = "3RIMG_19JUN2026_0015_L2B_LST_V01R00.h5"

    class Config:
        env_file = ".env"

settings = Settings()
