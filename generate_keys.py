import os
import datetime
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives import serialization
from cryptography import x509
from cryptography.x509.oid import NameOID
from cryptography.hazmat.primitives import hashes

def generate_keys():
    print("Generating secure RSA keys for Stitch Money...")
    
    # 1. Generate Private Key
    private_key = rsa.generate_private_key(
        public_exponent=65537,
        key_size=2048,
    )

    # 2. Serialize Private Key to PEM
    private_pem = private_key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.TraditionalOpenSSL,
        encryption_algorithm=serialization.NoEncryption()
    )

    # Save Private Key
    with open("private_key.pem", "wb") as f:
        f.write(private_pem)

    # 3. Create a Self-Signed Public Certificate (Valid for 1 year)
    subject = issuer = x509.Name([
        x509.NameAttribute(NameOID.COUNTRY_NAME, "ZA"),
        x509.NameAttribute(NameOID.STATE_OR_PROVINCE_NAME, "Gauteng"),
        x509.NameAttribute(NameOID.LOCALITY_NAME, "Johannesburg"),
        x509.NameAttribute(NameOID.ORGANIZATION_NAME, "Resume Builder"),
        x509.NameAttribute(NameOID.COMMON_NAME, "Stitch Client App"),
    ])

    cert = x509.CertificateBuilder().subject_name(
        subject
    ).issuer_name(
        issuer
    ).public_key(
        private_key.public_key()
    ).serial_number(
        x509.random_serial_number()
    ).not_valid_before(
        datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=1)
    ).not_valid_after(
        datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=365)
    ).sign(private_key, hashes.SHA256())

    # 4. Serialize Public Certificate to PEM
    cert_pem = cert.public_bytes(serialization.Encoding.PEM)

    # Save Public Certificate
    with open("public_key.pem", "wb") as f:
        f.write(cert_pem)

    print("Success! Created key pair:")
    print("  🔑 private_key.pem (keep safe, do not share)")
    print("  📄 public_key.pem (upload this to Stitch dashboard)")

if __name__ == "__main__":
    generate_keys()
