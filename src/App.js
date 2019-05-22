import React from 'react';
import Model from './Model.js';
import './index.css';

class InputButton extends React.Component {
    render() {
        return (
            <button 
                className="inputButton"
                onClick={this.props.handleInputClick}>
                Search
            </button>
        );
    }
}

class InputField extends React.Component {
    constructor(props) {
        super(props);
        this.handleKeyUp = this.handleKeyUp.bind(this);
    }

    render() {
        return (
            <input 
                type="text" 
                className="inputField"
                onChange={this.props.handleInputChange}
                onKeyUp={this.handleKeyUp}
            />
        );
    }

    handleKeyUp(e) {
        e.preventDefault();
        if (e.keyCode === 13) 
            this.props.handleEnterPress();
    }
}

class RequestInput extends React.Component {
    render() {
        return (
            <div className="requestWrapper">
                <div className="requestInput">
                    <InputField 
                        handleInputChange={this.props.handleQueryChange}
                        handleEnterPress={this.props.handleRequestExecution}
                    />
                    <InputButton 
                        handleInputClick={this.props.handleRequestExecution}
                    />
                </div>
            </div>
        );
    }
}

class SourceButton extends React.Component {
    render() {
        return (
            <button 
                className={"sourceButton" + (this.props.toggled ? " activeFilter" : "")}
                id={this.props.id}>
                {this.props.name}
            </button>
        );
    }
}

class SourceFilter extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    render() {
        return (    
            <div className="sourceFilterWrapper">
                <nav className="sourceFilter" onClick={this.handleClick}>
                    {
                        this.props.sources.map((source) => 
                            <SourceButton 
                                key={source.id}
                                id={source.id} 
                                name={source.name}
                                toggled={this.props.toggled.has(source.id)}
                            />
                        )
                    }
                </nav>
            </div>
        );
    }

    handleClick(e) {
        if (e.target.classList.contains("sourceButton")) {
            this.props.toggle(e.target.id);
            this.props.handleInputClick();
        }
    }
}

class Article extends React.Component {
    render() {
        let article = this.props.article;
        let info = article.source.name;
        if (article.publishedAt) {
            info += ', ' + new Date(article.publishedAt).toLocaleString("en-US", {
                hour12: false, day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
            });
        }
        if (article.author) {
            info += ', Author: ' + article.author;
        }
        return (
            <div className="contentElementWrapper">
                <div className="contentElement">
                    <div 
                        className="contentElementImg"
                        style={{backgroundImage: `url("${article.urlToImage}")`}}>
                    </div>
                    <article className="article">
                        <a 
                            className="articleLink"
                            href={article.url}>
                            <header className="articleHeader">
                                <h2 className="articleTitle">
                                    {article.title}
                                </h2>
                                <span className="articleInfo">
                                    {info}
                                </span>
                            </header>
                            <section className="articleBody">
                                {article.description}
                            </section>
                        </a>
                    </article>
                </div>
            </div>
        );
    }
}

class News extends React.Component {
    render() {
        return (
            <div className="contentWrapper">
                {
                    this.props.loaded.map((article, index) => 
                        <Article 
                            key={index}
                            article={article}
                        />
                    )
                }
            </div>
        );
    }
}

class FailMessage extends React.Component {
    render() {
        if (this.props.visible) {
            return (
                <div className="failMessageWrapper">
                    <h1 className="failMessage">
                        {this.props.message}
                    </h1>
                </div>
            );
        } else {
            return null;
        }
    }
}

class MoreButton extends React.Component {
    render() {
        if (this.props.visible) {
            return (
                <div className="moreButtonWrapper">
                    <button 
                        className="moreButton"
                        onClick={this.props.moreButtonClick}>
                        Show more
                    </button>   
                </div>
            );
        } else {
            return null;
        }
    }
}

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sources: [],
            loaded: [],
            toggled: new Set(),
            hasMore: false,
            query: ""
        }
        this.MAX_DISPLAYED = 40;

        this.toggle = this.toggle.bind(this);
        this.handleQueryChange = this.handleQueryChange.bind(this);
        this.handleRequestExecution = this.handleRequestExecution.bind(this);
        this.moreButtonClick = this.moreButtonClick.bind(this);
    }

    componentDidMount() {
        this.model = new Model();
        this.model.loadSources().then(value => {
            this.setState({
                sources: value.sources
            });
        });
        this.model.loadRequest().then(() => {
            this.setState({
                loaded: this.model.nextBatch(),
                hasMore: this.model.hasMore()
            });
        });
    }

    render() {
        return (
            <main className="sticky">
                <RequestInput 
                    loadRequest={this.loadRequest}
                    handleQueryChange={this.handleQueryChange}
                    handleRequestExecution={this.handleRequestExecution}
                />
                <SourceFilter 
                    sources={this.state.sources} 
                    toggle={this.toggle}
                    toggled={this.state.toggled}
                    handleInputClick={this.handleRequestExecution}
                />
                <News
                    loaded={this.state.loaded} 
                />
                <FailMessage
                    visible={!this.state.loaded.length} 
                    message="There are no articles matching your request"
                />
                <MoreButton 
                    visible={this.state.hasMore && this.state.loaded.length < this.MAX_DISPLAYED}
                    moreButtonClick={this.moreButtonClick}
                />
            </main>
        );
    }

    toggle(id) {
        let t = this.state.toggled;
        if (t.has(id)) {
            t.delete(id); 
        } else {
            t.add(id);
        }
        this.setState({
            toggled: t
        });
    }

    handleQueryChange(query) {
        this.setState({
            query: query.target.value
        });
    }

    handleRequestExecution() {
        this.model.loadRequest({q: this.state.query}, this.state.toggled).then(() => {
            this.setState({
                loaded: this.model.nextBatch(),
                hasMore: this.model.hasMore()
            });
        });
    }

    moreButtonClick() {
        this.setState({
            loaded: this.state.loaded.concat(this.model.nextBatch()),
            hasMore: this.model.hasMore()
        });
    }
}

class Footer extends React.Component {
    render() {
        return (
            <footer className="sticky">
                <p className="poweredBy">
                    Powered by 
                    <a href="https://newsapi.org">
                        NewsAPI
                    </a>
                </p>
            </footer>
        );
    }
}

class App extends React.Component {
    render() {
        return (
            <div className="sticky">
                <Main />
                <Footer />
            </div>
        );
    }
}

export default App;
