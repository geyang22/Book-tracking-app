import React from 'react'
import './App.css'
import {Route, Link} from 'react-router-dom'
//import escapeRegExp from 'escape-string-regexp'
import * as BooksAPI from './BooksAPI'
import Book from "./Book"

class BooksApp extends React.Component {
  state = {
    query: '',
    books: [],
    showingBooks: []
  }

//Fetching the API once the component has mounted
componentDidMount() {
  BooksAPI.getAll().then((books) => {
  	this.setState({ books })
  })
}

updateShelf = (book, shelf) => {
    let books;
    if (this.state.books.findIndex(b => b.id === book.id) > 0) {
      // change the position of an existing book in the shelf
      books = this.state.books.map(b => {
        if (b.id === book.id) {
          return {...book, shelf}
        } else {
          return b
        }
      })
    } else {
      // add a new book to the shelf
      books = [...this.state.books, {...book, shelf}]
    }
  
   this.setState({books})

    BooksAPI.update(book, shelf).then((data) => {
      // shelf updated on the server
    })
  }

updateBook = (book, shelf) => {
    this.updateShelf(book, shelf)
  }
 
 
//Updating search results dynamically
updateQuery = (query) => {
  this.setState({query})
   let showingBooks = []
	if(query){
             BooksAPI.search(query).then(matches => {
               if(matches.length>0){
                 showingBooks = matches.map(b => {
              	const index = this.state.books.findIndex(c => c.id === b.id)
                if( index>= 0) {
                   return this.state.books[index]
                 } else{
                   return b
                 }
               })
               }
               this.setState({ showingBooks })
            })
         } else {
           showingBooks = this.state.books
         }
}

  render() {
   
 
    return (
      <div className="app">
       {/*
     **Using the URL in the browser's address bar to display subpages
     */}
         <Route exact path="/search" render={() => (
          <div className="search-books">
            <div className="search-books-bar">
              <Link className="close-search" to="/">Close</Link>
              <div className="search-books-input-wrapper">
                <input type="text" placeholder="Search by title or author" value={this.state.query} onChange={(event)=>this.updateQuery(event.target.value)}/>
              </div>
            </div>
            <div className="search-books-results">
              <ol className="books-grid">
	{this.state.showingBooks.map((book)=>( 
  	<Book book={book} key={book.id}/>))}
</ol>
            </div>
          </div>
        )}/>
	 <Route exact path="/" render={() => (
          <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>
            <div className="list-books-content">
              <div>
                <div className="bookshelf">
                  <h2 className="bookshelf-title">Currently Reading</h2>
                  <div className="bookshelf-books">
                    <ol className="books-grid">
                     { this.state.books.filter(book => book.shelf === 'currentlyReading')
                    .map(book => (
                      <Book  book={book} key={book.id} onUpdateBook={(book, shelf) => this.updateBook(book, shelf)}></Book>
                    ))}
                    </ol>
                  </div>
                </div>
                <div className="bookshelf">
                  <h2 className="bookshelf-title">Want to Read</h2>
                  <div className="bookshelf-books">
                    <ol className="books-grid">
                      <Book/>
                    </ol>
                  </div>
                </div>
                <div className="bookshelf">
                  <h2 className="bookshelf-title">Read</h2>
                  <div className="bookshelf-books">
                    <ol className="books-grid">
                      <Book/>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
            <div className="open-search">
              <Link to="/search">Add a book</Link>
            </div>
          </div>
        )}/>
      </div>
    )
  }
}

export default BooksApp
