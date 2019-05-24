import React, { useContext } from 'react';
import { Link, withRouter } from 'react-router-dom';

import classes from './PostItem.module.scss';
import defaultAvatar from '../../../static/images/default-avatar.png';
import StateContext from '../../../context/state-context';
import { USER_URI, POST_URI } from '../../../constants/navigation';
import { LIKE_ICON, COMMENT_ICON } from '../../../constants/icons';
import { LIKE_POST } from '../../../constants/actions';
import { POSTS, POST_LIKE, COMMENTS } from '../../../constants/fbCollections';
import firebase from '../../../global/firebase';

const PostItem = (props: any) => {
    const stateContext: any = useContext(StateContext);
    const dispatch = stateContext[1];
    const currentUser: any = firebase.auth().currentUser;

    const onLikeButtonPressedHandler = async () => {
        if (!props.liked) {
            dispatch({
                type: LIKE_POST,
                postId: props.postId
            });

            await firebase.firestore()
                .collection(props.type === "comment" ? COMMENTS : POSTS)
                .doc(props.postId)
                .collection(POST_LIKE)
                .doc(currentUser.uid)
                .set({
                    likedAt: new Date().toISOString()
                });

            await firebase.firestore()
                .collection(props.type === "comment" ? COMMENTS : POSTS)
                .doc(props.postId)
                .update({
                    likes: props.likes + 1
                });
        }
    }

    return (
        <div className={classes.PostItem}>
            <div className={classes.AvatarSection}>
                <img
                    src={!props.creator.photoURL || props.creator.photoURL === '' ?  defaultAvatar : props.creator.photoURL} 
                    alt="Loading..."
                />
                <Link to={`${USER_URI}${props.creator.username}`}>@{props.creator.username}</Link>
            </div>

            <div className={classes.PostContent}>
                {props.image && (
                    <img
                        className="postImg"
                        src={props.image}
                        alt="Loading..."
                    />
                )}
                {props.content}
            </div>

            <div className={classes.PostLinks}>
                <button className="flat" style={!props.liked ? { color: '#333' } : {}} onClick={onLikeButtonPressedHandler}>
                    <i className="material-icons">
                        {LIKE_ICON}
                    </i>
                    <span>{props.likes}</span>
                </button>

                {!props.hideComment && (
                    <button className="flat" style={{ color: '#333' }} onClick={() => props.history.push(`${POST_URI}${props.postId}`)}>
                        <i className="material-icons">
                            {COMMENT_ICON}
                        </i>
                    </button>
                )}
            </div>
        </div>
    )
}

export default withRouter(PostItem);