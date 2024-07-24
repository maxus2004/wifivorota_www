import toml

def getStrings(language):
    language_strings = toml.load("languages/"+language+".toml")
    return language_strings
