# Mapping from internal label to Chinese text
LABEL_MAP = {
    "SIGN_NI_HAO": "你好",
    # Add more mappings as needed
}

def label_to_chinese(label):
    return LABEL_MAP.get(label, label)
