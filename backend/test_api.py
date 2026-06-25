from fastapi.testclient import TestClient
from main import app, get_db
from database import Base, engine, SessionLocal
import models
import os

# Use an in-memory SQLite database for testing
models.Base.metadata.create_all(bind=engine)

client = TestClient(app)

def test_workflow():
    # 1. Create user
    response = client.post("/users/", json={"username": "testuser", "password": "password123"})
    assert response.status_code == 200, f"Register failed: {response.text}"
    print("✅ User registered")

    # 2. Login
    response = client.post("/token", data={"username": "testuser", "password": "password123"})
    assert response.status_code == 200, f"Login failed: {response.text}"
    token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print("✅ Logged in")

    # 3. Add Medication
    med_data = {"name": "Aspirin", "dosage": "500mg", "frequency_hours": 12.0}
    response = client.post("/medications/", json=med_data, headers=headers)
    assert response.status_code == 200, f"Add medication failed: {response.text}"
    med_id = response.json()["id"]
    print("✅ Medication added")

    # 4. Take Medication
    response = client.post(f"/medications/{med_id}/take", headers=headers)
    assert response.status_code == 200, f"Take medication failed: {response.text}"
    print("✅ Medication taken")
    
    # Verify next_due and last_taken are set
    med = response.json()
    assert med["last_taken"] is not None
    assert med["next_due"] is not None
    print("✅ Timeline verified")

if __name__ == "__main__":
    test_workflow()
    print("All tests passed! 🤘")
