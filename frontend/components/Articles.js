import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PT from 'prop-types'
export default function Articles(props) {
  // ✨ where are my props? Destructure them here 
  const { articles, getArticles, deleteArticle, updateArticle, setCurrentArticleId, currentArticleId } = props
  
  // ✨ implement conditional logic: if no token exists
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  // we should render a Navigate to login screen (React Router v.6)

  useEffect(() => {
    // ✨ grab the articles here, on first render only
    if(!token){
      navigate('/')
    } else {
      getArticles();
    }
    // !token && navigate("/") 
    // getArticles();
  }, [])
  return (
    // ✨ fix the JSX: replace `Function.prototype` with actual functions
    // and use the articles prop to generate articles
    <div className="articles">
      <h2>Articles</h2>
      {
        !articles.length
          ? 'No articles yet'
          : articles.map(article => {
            return (
              <div className="article" key={article.article_id}>
                <div>
                  <h3>{article.title}</h3>
                  <p>{article.text}</p>
                  <p>Topic: {article.topic}</p>
                </div>
                <div>
                  <button disabled={currentArticleId ? true : false} onClick={() =>  setCurrentArticleId(article.article_id)}>Edit</button>
                  <button disabled={currentArticleId ? true: false} onClick={() => deleteArticle(article.article_id)}>Delete</button>
                </div>
              </div>
            )
          })
      }
    </div>
  )
}

// 🔥 No touchy: Articles expects the following props exactly:
Articles.propTypes = {
  articles: PT.arrayOf(PT.shape({ // the array can be empty
    article_id: PT.number.isRequired,
    title: PT.string.isRequired,
    text: PT.string.isRequired,
    topic: PT.string.isRequired,
  })).isRequired,
  getArticles: PT.func.isRequired,
  deleteArticle: PT.func.isRequired,
  setCurrentArticleId: PT.func.isRequired,
  currentArticleId: PT.number, // can be undefined or null
}
