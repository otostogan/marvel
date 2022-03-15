import {useState, useEffect} from 'react';
import MarvelService from '../../services/MarverlServices';
import Spinner from '../spinner/spinner';
import ErrorMessage from '../errorMessage/ErrorMesage';

import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';

const transformDescr = (desc) => {
    if(desc){
        const fullDescArr = desc.split(' ');
    
        let newDescArr = [];
        for(let i = 0; i < fullDescArr.length; i++){
            if(i < 30){
                newDescArr.push(fullDescArr[i])
            }else if(i === 31){
                newDescArr.push('...')
            }   
        }
        return newDescArr.join(" ");
    }else{
        return "We couldn't find a description for this character."
    }
    
}
const RandomChar = () => {

    const marvelService = new MarvelService();

    const [char, setChar] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, seterror] = useState(false);

    useEffect(()=>{
        updateChar();
    }, []);

   
    const onCharLoaded = (char) => {
        setChar(char);
        setLoading(false);
    }
    const onError = () => {
        seterror(true);
        setLoading(false);
    }
    const onCharUpdate = () => {
        setLoading(true);
        updateChar();
    }
    const updateChar = () => {
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
        marvelService
            .getCharacter(id)
            .then(onCharLoaded)
            .catch(onError);
    }
    

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;

    const content = !(loading || error) ? <View char={char}/> : null

    return (
        <div className="randomchar">
            {errorMessage}
            {spinner}
            {content}
            <div className="randomchar__static">
                <p className="randomchar__title">
                    Random character for today!<br/>
                    Do you want to get to know him better?
                </p>
                <p className="randomchar__title">
                    Or choose another one
                </p>
                <button onClick={onCharUpdate} className="button button__main">
                    <div className="inner">try it</div>
                </button>
                <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
            </div>
        </div>
    )
    
}

const View = ({char}) => {

    const {name, description, thumbnail, homepage, wiki} = char;

    const thumbnailStyle = thumbnail.includes('image_not_available.jpg') ? {objectFit: 'contain'} : null;
    

    return (
        <div className="randomchar__block">
            <img style={thumbnailStyle} src={thumbnail} alt="Random character" className="randomchar__img"/>
            <div className="randomchar__info">
                <p className="randomchar__name">{name}</p>
                <p className="randomchar__descr">
                    {transformDescr(description)} 
                </p>
                <div className="randomchar__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">Wiki</div>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default RandomChar;