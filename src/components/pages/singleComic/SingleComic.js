import {useParams, Link} from 'react-router-dom';
import {useState, useEffect} from 'react';
import useMarvelService from '../../../services/MarverlServices';


import Spinner from '../../spinner/spinner';
import ErrorMessage from '../../errorMessage/ErrorMesage';


import './singleComic.scss';

const SingleComic = () => {

    const {comicID} = useParams();
    const [comic, setComic] = useState(null);

    const {error, loading, getComics, clearError} = useMarvelService();

    useEffect(()=>{
        updataComic(comicID)
    }, [comicID])

    const updataComic = (id) => {
        clearError();
        getComics(id)
            .then(onComicLoaded)
    }

    const onComicLoaded = (comic) => {
        setComic(comic);
    }

    const spinner = loading ? <Spinner/> : null;
    const errorMessage = error ? <ErrorMessage/> : null;
    const content = !(loading || error || !comic) ? <View char={comic}/> : null

    return (
        <>
           {spinner}
           {content}
           {errorMessage}
        </>
    )
}
const View = ({char}) =>{
    const {title, description, thumbnail, pageCount,language, price} = char;

    return (
        <div className="single-comic">
            <img src={thumbnail} alt={title} className="single-comic__img"/>
            <div className="single-comic__info">
                <h2 className="single-comic__name">{title}</h2>
                <p className="single-comic__descr">{description}</p>
                <p className="single-comic__descr">{pageCount}</p>
                <p className="single-comic__descr">Language: {language}</p>
                <div className="single-comic__price">{price}</div>
            </div>
            <Link to="/comics" className="single-comic__back">Back to all</Link>
        </div>
    )
}

export default SingleComic;