import {useState, useEffect} from 'react';
import useMarvelService from '../../services/MarverlServices';
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

    const {error, loading, getCharacter, clearError} = useMarvelService();

    const [char, setChar] = useState({});

    useEffect(()=>{
        updateChar();
    }, []);

   
    const onCharLoaded = (char) => {
        setChar(char);
    }
    const onCharUpdate = () => {
        updateChar();
    }
    const updateChar = () => {
        clearError();
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
        getCharacter(id)
            .then(onCharLoaded)
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

    // const thumbnailStyle = thumbnail.includes('image_not_available.jpg') ? {objectFit: 'contain'} : null;
    

    return (
        <div className="randomchar__block">
            <img  src={thumbnail} alt="Random character" className="randomchar__img"/>
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