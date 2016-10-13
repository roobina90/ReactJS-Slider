const Slide = React.createClass({
    displayName: "Slide",

    getInitialState() { return {} },

    render() {
        return (
            <img src={this.props.source} width="200" className = {this.props.className}/>
        );
    }

});

const Slider = React.createClass({
    displayName: "Slider",
    currentSlide: 0,
    getInitialState() { return { currentSlide: 0, slidesCount: 0 } },
    componentDidMount() {
        this.setState({slidesCount: this.props.sources.length});
    },
    nextClicked(_) {
        var newCurrentSlide = (this.state.currentSlide + 1) % this.state.slidesCount;
        this.setState({ currentSlide: newCurrentSlide});
    },

    prevClicked(_) {
        var newCurrentSlide =(this.state.slidesCount + this.state.currentSlide - 1) % this.state.slidesCount;
        this.setState({ currentSlide: newCurrentSlide});
    },


    render() {
        const currentSlide = this.state.currentSlide;
        const slides = this.props.sources.map(function (imgPath, index) {
            console.log(this);
            let className = "active-" + (currentSlide === index);
            return <Slide source={imgPath} className={className}/>;
        });
        return (
            <div id="slider">
                <button onClick={this.prevClicked}>Prev</button>
                <button onClick={this.nextClicked}>Next</button>
                <div id="slides">{slides}</div>
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
                <Slider sources={images}/>
            </div>

        );
    }
});


ReactDOM.render(<App />, document.getElementById("main"));