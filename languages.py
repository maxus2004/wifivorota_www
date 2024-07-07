import tomllib

def getStrings(language):
    language_file = open("languages/"+language+".toml", "rb")
    langage_strings = tomllib.load(language_file)
    return langage_strings