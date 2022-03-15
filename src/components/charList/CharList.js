import { useState, useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import MarvelService from '../../services/MarverlServices';
import Spinner from '../spinner/spinner';
import ErrorMessage from '../errorMessage/ErrorMesage';


import './charList.scss';


const CharList = (props) => {

    const [charsList, setChars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(false);
    const [charEnd, setcharEnd] = useState(false);

  
    const marvelService = new MarvelService();

    useEffect(() =>{
        onRequest();
    }, [])

    const onRequest = (offset) => {
        onCharListLoading();
            marvelService.getAllCharacters(offset)
            .then(onCharLoaded)
            .catch(onError);
    }

    const onCharListLoading = () => {
        setNewItemLoading(true);
    }
   
    const onCharLoaded = (newCharsList) => {

        let ended = false;

        if(newCharsList.length < 9){
            ended = true;
        }

        setChars(charList => [...charList, ...newCharsList]);
        setLoading(loading => false);
        setNewItemLoading(NewItemLoading => false);
        setOffset(offset => offset + 9);
        setcharEnd(charEnd => ended)
    }
    const onError = () => {
        setLoading(false);
        setError(true);
    }

    const itemRefs = useRef([]);
    
    const focusOnItem = (id) =>{

        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'))
        itemRefs.current[id].classList.add('char__item_selected');
        itemRefs.current[id].focus();

    }

    function renderItems(arr) {
        const items =  arr.map((item, i) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }
            
            return (
                <li 
                    className="char__item"
                    tabIndex={0}
                    ref={el => itemRefs.current[i] = el}
                    key={item.id}
                    onClick={() => {
                        props.onCharSelected(item.id);
                        focusOnItem(i);
                    }}
                    onKeyPress={(e) => {
                        if (e.key === ' ' || e.key === "Enter") {
                            props.onCharSelected(item.id);
                            focusOnItem(i);
                        }
                    }}>
                        <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                        <div className="char__name">{item.name}</div>
                </li>
            )
        });
        // А эта конструкция вынесена для центровки спиннера/ошибки
        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }


    const items = renderItems(charsList);

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner charlist /> : null;
    const content = !(loading || error) ? items : null

    return (
        <div className="char__list">
            <ul className="char__grid">
                {errorMessage}
                {spinner}
                {content}
            </ul>
            <button onClick={()=>{onRequest(offset)}} 
                    className="button button__main button__long"
                    disabled={newItemLoading}
                    style={{display: charEnd ? 'none' : 'block'}}
                    >
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

CharList.propTypes = {
    onCharSelected: PropTypes.func
}

export default CharList;