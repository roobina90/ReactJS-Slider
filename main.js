const Slide = React.createClass({
    render() {
        return (
            <img src={this.props.source} width="200" className={this.props.className} />
        );
    }

});

const Controls = React.createClass({
    render() {
        const currentSlide = this.props.currentSlide,
        dotsArray = Array.apply(null, {length: this.props.slidesCount});


        const dots = dotsArray.map(function (_, index) {
            let className = "dot active-" + (currentSlide === index);
            return <div className={className}></div>;
        });
        return (
            <div id="dots">{dots} </div>
        );
    }

});


const Slider = React.createClass({
    _state: { currentSlide: 0, slidesCount: 0 },

    getInitialState() { return this._state },

    nextClicked(_) {
        var newCurrentSlide = (this.state.currentSlide + 1) % this.state.slidesCount;
        this.setState({ currentSlide: newCurrentSlide });
    },
    prevClicked(_) {
        var newCurrentSlide = (this.state.slidesCount + this.state.currentSlide - 1) % this.state.slidesCount;
        this.setState({ currentSlide: newCurrentSlide });
    },

    componentDidMount() {
        this.setState({ slidesCount: this.props.sources.length });
    },


    render() {
        const currentSlide = this.state.currentSlide,
            slidesCount = this.state.slidesCount;
        const slides = this.props.sources.map(function (imgPath, index) {
            let className = "active-" + (currentSlide === index);
            return <Slide source={imgPath} className={className} />;
        });

        return (
            <div id="slider">
                <button onClick={this.prevClicked}>Prev</button>
                <button onClick={this.nextClicked}>Next</button>
                <div id="slides">{slides}</div>
                <Controls currentSlide={currentSlide} slidesCount={slidesCount} />

            </div>
        );
    }
});


const App = React.createClass({
    displayName: "App",
    render() {
        const images = ["images/p1.jpg", "images/p2.jpg", "images/p3.jpg"];
        return (
            <div id="app">
                <Slider sources={images} />
            </div>

        );
    }
});


ReactDOM.render(<App />, document.getElementById("main"));
