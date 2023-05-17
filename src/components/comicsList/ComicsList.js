import './comicsList.scss';
import Spinner from '../spinner/spinner';
import useMarvelService from '../../services/MarvelService';
import { useEffect, useState } from 'react';
import ErrorMessenge from '../errorMessenge/errorMessenge';

const ComicsList = () => {
    const [data, setData] = useState([]);
    const [offset, setOffset] = useState(216);
    const [newComics, setNewComics] = useState(false);
    const [comicsEnded, setComicsEnded] = useState(false);



    const { error, loading, getAllComics } = useMarvelService();



    useEffect(() => {
        onRequest(offset, true)
    }, [])


    const onRequest = (offset, initial) => {
        initial ? setNewComics(false) : setNewComics(true)
        getAllComics(offset)
            .then(onComicsLoaded)
    }

    const onComicsLoaded = (newComics) => {
        let ended = false;
        if (newComics.length < 8) {
            ended = true;
        }

        setData([...data, ...newComics]);
        setOffset(offset => offset + 8);
        setComicsEnded(ended)
    }


    const items = data.map((item) => {
        const { id, thumbnail, name, price } = item
        const truePrice = price === 0 ? 'Price not known' : price;

        return (
            <li key={id} alt={name} className="comics__item" >
                <a href="#">
                    <img src={thumbnail} alt="ultimate war" className="comics__item-img" />
                    <div className="comics__item-name">{name}</div>
                    <div className="comics__item-price">{truePrice}</div>
                </a>
            </li>
        )
    })

    const spinner = loading && !newComics ? <Spinner /> : null;
    const hiddenButton = { 'display': (spinner || comicsEnded ? 'none' : null) }
    const ifError = error ? <ErrorMessenge /> : null;
    return (
        <div className="comics__list">
            {ifError}
            {spinner}
            <ul className="comics__grid">
                {items}
            </ul>
            <button onClick={() => onRequest(offset)}
                style={hiddenButton}
                className="button button__main button__long">
                <div className="inner" >load more</div>
            </button>
        </div>
    )
}

export default ComicsList;