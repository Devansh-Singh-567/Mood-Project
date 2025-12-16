def rotate(items, index):
    if not items:
        return None, 0
    item = items[index % len(items)]
    return item, (index + 1) % len(items)
