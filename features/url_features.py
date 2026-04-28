import re
from urllib.parse import urlparse


def extract_url_features(url):
    try:
        parsed = urlparse(url)
        hostname = parsed.hostname if parsed.hostname else ""
    except Exception:
        # If URL parsing fails, return neutral/safe defaults
        return [0, 0, 0, 0, 0, 0, 0, 0, 0]

    features = []

    # 1. URL length
    features.append(len(url))

    # 2. Hostname length
    features.append(len(hostname))

    # 3. Number of dots
    features.append(url.count("."))

    # 4. Number of hyphens
    features.append(url.count("-"))

    # 5. Number of @ symbols
    features.append(url.count("@"))

    # 6. Number of slashes
    features.append(url.count("/"))

    # 7. Contains IP address
    features.append(1 if re.search(r"\d+\.\d+\.\d+\.\d+", url) else 0)

    # 8. Uses HTTPS
    features.append(1 if url.startswith("https") else 0)

    # 9. Suspicious keywords
    suspicious_keywords = ["login", "verify", "update", "bank", "secure"]
    features.append(1 if any(word in url.lower() for word in suspicious_keywords) else 0)

    return features

if __name__ == "__main__":
    test_url = "http://secure-login-update-bank.com/account"
    print(extract_url_features(test_url))
