import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'
import axios from 'axios'
import { axiosWithAuth } from '../axios'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'


export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => { navigate("/") }
  const redirectToArticles = () => { navigate("/articles") }

  const logout = () => {
    // ✨ implement
    localStorage.clear();
    setMessage('Goodbye!');
    redirectToLogin();
    setSpinnerOn(false)
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
  }

  const login = ({ username, password }) => {
    setSpinnerOn(true);
    setMessage("");
    axios.post(loginUrl, { 'username': username, 'password': password })
      .then(res => {
        localStorage.setItem('token', res.data.token)
        redirectToArticles();
        
      })
      .catch(err => console.log(err))
      setSpinnerOn(false);
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!
  }

  const getArticles = () => {
    setMessage('');
    setSpinnerOn(true);
    axiosWithAuth()
      .get('http://localhost:9000/api/articles')
      .then(res => {
        setArticles(res.data.articles)
        setMessage(res.data.message)
      })
      .catch(err => {console.log(err)})
    setSpinnerOn(false);
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch an authenticated request to the proper endpoint.
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!
  }
  const postArticle = article => {
    axiosWithAuth().post('http://localhost:9000/api/articles', article)
      .then(res => {
        articles.push(res.data.article)
        setMessage(res.data.message)
      })
      .catch(err => {
        console.log(err);
      })
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
  }

  const updateArticle = ( id, article ) => {
    // ✨ implement
    // You got this!
    axiosWithAuth().put(`http://localhost:9000/api/articles/${id}`, article)
      .then(res => {
        setCurrentArticleId(null);
        setArticles(articles.map(a => a.article_id === id ? res.data.article : a));
        setMessage(res.data.message)
        // setCurrentArticleId(null);
      })
      .catch(err => { 
        console.log(err)   
      })
  }

  const deleteArticle = article_id => {
    // ✨ implement
    axiosWithAuth().delete(`http://localhost:9000/api/articles/${article_id}`)
      .then(res => {
        console.log(res)
        setArticles(articles.filter(a => a.article_id !== article_id))  
        setMessage(res.data.message);
      })
      .catch(err => {
        console.log(err)
      })
  }

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn}/>
      <Message message={message} />
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} navigateLogin={redirectToLogin} navigateArticles={redirectToArticles}/>} />
          <Route path="/articles" element={
            <>
              <ArticleForm postArticle={postArticle} updateArticle={updateArticle} currentArticle={articles.find(a => a.article_id === currentArticleId)} setCurrentArticleId={setCurrentArticleId} currentArticleId={currentArticleId}/>
              <Articles getArticles={getArticles} articles={articles} setCurrentArticleId={setCurrentArticleId} currentArticleId={currentArticleId} deleteArticle={deleteArticle}/>
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  )
}
