import colorsys
import hashlib

def word_to_rgb(word, index, total_words, base_hue_offset):

    word_hash = hashlib.md5(word.encode()).hexdigest()
    word_int = int(word_hash, 16)


    hue = (base_hue_offset + (index / total_words)) % 1 


    saturation = 0.7 + ((word_int % 50) / 200)
    lightness = 0.5 + ((word_int % 100) / 300)


    r, g, b = colorsys.hls_to_rgb(hue, lightness, saturation)
    return (int(r * 255), int(g * 255), int(b * 255))

def sentence_to_distinct_colors(sentence):
    words = sentence.split()
    total_words = len(words)


    first_word_hash = hashlib.md5(words[0].encode()).hexdigest()
    base_hue_offset = (int(first_word_hash, 16) % 360) / 360

    colors = [word_to_rgb(word, index, total_words, base_hue_offset) for index, word in enumerate(words)]
    return colors