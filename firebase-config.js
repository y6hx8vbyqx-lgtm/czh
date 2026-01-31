// Добавьте эти функции управления лайками:

async function toggleLike(postId, postElement) {
    const user = auth.currentUser;
    if (!user) {
        alert('Войдите, чтобы ставить лайки!');
        return;
    }

    const likeRef = db.collection('posts').doc(postId).collection('likes').doc(user.uid);
    const postRef = db.collection('posts').doc(postId);
    
    try {
        // Проверяем, есть ли уже лайк
        const likeDoc = await likeRef.get();
        
        if (likeDoc.exists) {
            // Убираем лайк
            await likeRef.delete();
            await postRef.update({
                likesCount: firebase.firestore.FieldValue.increment(-1)
            });
            updateLikeUI(postElement, false);
        } else {
            // Добавляем лайк
            await likeRef.set({
                userId: user.uid,
                createdAt: new Date(),
                username: currentUserData?.username || 'Аноним'
            });
            await postRef.update({
                likesCount: firebase.firestore.FieldValue.increment(1)
            });
            updateLikeUI(postElement, true);
        }
    } catch (error) {
        console.error('Ошибка лайка:', error);
    }
}

function updateLikeUI(element, isLiked) {
    const heart = element.querySelector('.like-heart');
    const countEl = element.querySelector('.like-count');
    
    if (heart) {
        heart.textContent = isLiked ? '❤️' : '🤍';
        heart.style.color = isLiked ? '#e53e3e' : '#a0aec0';
    }
    
    if (countEl) {
        const currentCount = parseInt(countEl.textContent) || 0;
        countEl.textContent = isLiked ? currentCount + 1 : Math.max(0, currentCount - 1);
    }
}
