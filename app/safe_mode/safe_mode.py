def trigger_safe(moods):
    bad = {"Overwhelmed", "Sad"}
    return sum(m in bad for m in moods) >= 2
