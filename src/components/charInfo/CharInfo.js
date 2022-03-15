import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import MarvelService from '../../services/MarverlServices';
import Spinner from '../spinner/spinner';
import ErrorMessage from '../errorMessage/ErrorMesage';
import Skeleton from '../skeleton/Skeleton';

import './charInfo.scss';

const CharInfo = (props) => {

    const marvelService = new MarvelService();

    const [char, setChar] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, seterror] = useState(false);

    useEffect(()=>{
        updateChar();
    }, []);

    useEffect(()=>{
        updateChar();
    }, [props.charId]);

    const updateChar = () => {
        const {charId} = props;
        if(!charId) {
            return;
        }
        onCharLoading();
        marvelService
            .getCharacter(charId)
            .then(onCharLoaded)
            .catch(onError)
    }

    const onCharLoaded = (char) => {
        setChar(char);
        setLoading(false);
    }
    const onError = () => {
        setLoading(false);
        seterror(true);
    }
    const onCharLoading = () => {
        setLoading(false);
    }
    

    

    const skeleton = char || loading || error ? null : <Skeleton/>;
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error || !char) ? <View char={char}/> : null

    return (
        <div className="char__info">
            {skeleton}
            {errorMessage}
            {spinner}
            {content}
        </div>
    )
}

const View = ({char}) =>{

    const {name, description, thumbnail, homepage, wiki, comics} = char;
    
    const thumbnailStyle = thumbnail.includes('image_not_available.jpg') ? {objectFit: 'contain'} : null
    const comicsContent = comics.length > 0 ? <ComicsList comics={comics} /> : null;

    return (
        
        <>
            <div className="char__basics">
                <img style={thumbnailStyle} src={thumbnail} alt={name}/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
              {description}
            </div>
            {comicsContent}

            
        </>
    )
}

const ComicsList = ({comics}) =>{
   return (
        <>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {
                    comics.map((item, i) => {
                        if(i>10) return null;
                        return(
                            <li key={i} className="char__comics-item">
                                {item.name}
                            </li>
                        )
                    })
                }
            </ul>
        </>
   )
}

CharInfo.propTypes = {
    charId: PropTypes.number
}

export default CharInfo;