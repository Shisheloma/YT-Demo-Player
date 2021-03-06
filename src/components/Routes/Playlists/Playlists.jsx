import { useCallback, useContext, useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';

import { LayoutContext } from '../../../contexts/LayoutContext';
import ThumbnailPlaylist from '../../UI/ThumbnailPlaylist/ThumbnailPlaylist';
import Spinner from '../../UI/Spinner/Spinner';

import apiRequest from '../../../utils/apiRequest';
import useFetch from '../../../utils/useFetch';
import useSetTitle from '../../../utils/useSetTitle';

const Playlists = () => {

    const [isLoading, setIsLoading] = useState(true);
    const [Pl, setPl] = useState([]);    
    const transitionNodeRef = useRef();
    const transitionNodeRef2 = useRef();
    const { layout: {menuActive}, setLayout } = useContext(LayoutContext);
    const savedPl = localStorage.getItem('savedPlaylists');

    const doFetch = useCallback( async savedPl => {
            const { data: { items } } = 
                await apiRequest.get('/playlists', 
                    { params: { 
                        part: 'contentDetails,snippet',
                        id: savedPl}
                    });
            setPl(items);
            setIsLoading(false);
    }, []);

    useSetTitle('playlists', '', [], setLayout);
    useFetch(doFetch, [savedPl], setIsLoading, [menuActive], true);

    return (
        <div className='screen_horizontal'> 
            <h2>Saved playlists:</h2>
            <CSSTransition  
                        in={isLoading} 
                        timeout={2100} 
                        classNames="transition_spinner" 
                        unmountOnExit 
                        nodeRef={transitionNodeRef}>   
                <div ref={transitionNodeRef}  className="transition_pos_abs">
                    <Spinner 
                            qty={4}
                            parent={"ThumbnailPlaylist"}
                            type='playlist' />
                </div>      
            </CSSTransition >
            <CSSTransition  
                        in={!isLoading} 
                        timeout={2100} 
                        classNames="transition" 
                        unmountOnExit 
                        nodeRef={transitionNodeRef2}> 
                <div ref={transitionNodeRef2} >
                    {Pl.map(pl => 
                        (<ThumbnailPlaylist object={pl}
                                            type='playlist'
                                            key={pl.id}
                                            lines={8}/>))}
                </div> 
            </CSSTransition >
        </div>
    )
}

export default Playlists

