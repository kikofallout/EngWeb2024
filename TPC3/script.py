import json

# Create new dictionaries to hold the films, cast, and genres
new_data = {'films': [], 'cast': [], 'genres': []}

# Create dictionaries to hold the unique genres and cast members
unique_genres = {}
unique_cast = {}

# Open the file and read lines one by one
with open('filmes.json', 'r') as f:
    for line in f:
        # Load each line as a separate JSON object
        film = json.loads(line)

        # Extract the ID from the '_id' dictionary and store it directly under 'id'
        film['id'] = film['_id']['$oid']
        del film['_id']

        # Extract the genres and cast from the film data and add them as separate entities in the genres and cast dictionaries
        if 'genres' in film:
            for genre in film['genres']:
                genre_id = unique_genres.setdefault(genre, {'id': len(unique_genres) + 1, 'name': genre, 'films': []})['id']
                unique_genres[genre]['films'].append(film['id'])
            film['genres'] = [unique_genres[genre]['id'] for genre in film['genres']]

        if 'cast' in film:
            for actor in film['cast']:
                actor_id = unique_cast.setdefault(actor, {'id': len(unique_cast) + 1, 'name': actor, 'films': []})['id']
                unique_cast[actor]['films'].append(film['id'])
            film['cast'] = [unique_cast[actor]['id'] for actor in film['cast']]

        # Add the film dictionary to the films dictionary
        new_data['films'].append(film)

# Add the unique genres and cast to the new_data dictionary
new_data['genres'] = list(unique_genres.values())
new_data['cast'] = list(unique_cast.values())

# Write the films, cast, and genres dictionaries to a new JSON file
with open('new_filmes.json', 'w') as f:
    json.dump(new_data, f, indent=4)