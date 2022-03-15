class MarvelService{

    _apiBase = "https://gateway.marvel.com:443/v1/public/";
    _apikey = "apikey=936810d106693b3e9d707f529c229809";
    _baseOffset = 210;

    getResources = async (url) =>{
        let res = await fetch(url);

        if(!res.ok){
            throw new Error(`Could not fetch ${url}, status ${res.status}`);
        }

        return await res.json();
    }
    getAllCharacters = async (offset = this._baseOffset) => {
        const res = await this.getResources(`${this._apiBase}characters?limit=9&offset=${offset}&${this._apikey}`);
        return res.data.results.map(this._transformCharacter);
    }
    getCharacter = async (id) => {
        const res = await this.getResources(`${this._apiBase}characters/${id}?${this._apikey}`);
        return this._transformCharacter(res.data.results[0]);
    }
    _transformCharacter = (character) => {
        return {
            name: character.name,
            description: character.description,
            thumbnail: character.thumbnail.path + '.' + character.thumbnail.extension,
            homepage: character.urls[0].url,
            wiki: character.urls[1].url, 
            id: character.id,
            comics: character.comics.items
        }
    }
}

export default MarvelService