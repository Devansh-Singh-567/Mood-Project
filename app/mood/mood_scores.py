from app.models import MoodEnum

MOOD_SCORES = {
    MoodEnum.overwhelmed: 1,
    MoodEnum.demotivated: 2,
    MoodEnum.anxious: 3,
    MoodEnum.stressed: 4,
    MoodEnum.sad: 5,
    MoodEnum.lazy: 6,
    MoodEnum.bored: 7,
    MoodEnum.neutral: 8,
    MoodEnum.motivated: 9,
    MoodEnum.happy: 10,
}

def mood_to_score(mood: MoodEnum) -> int:
    return MOOD_SCORES.get(mood, 5)
