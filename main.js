
//impure as hell
var BaseComponent = {
    //helpers
    _loopOverProperties(object, callback) {
        Object.keys(object).map(callback);
    },
    _copyMutualProperties(object1, object2, key) {
        if (object1.hasOwnProperty(key)) {
            if (object2.hasOwnProperty(key)) {
                object2[key] = object1[key];
            } else {
                throw `Undeclared property passed: ${key}`;
            }
        }
    },

    //public
    componentWillReceiveProps(nextProps) {
        this._loopOverProperties(nextProps, (key) => this._copyMutualProperties(nextProps, this._props, key));
    },

    componentWillMount() {
        this._loopOverProperties(this.props, (key) => this._copyMutualProperties(this.props, this._props, key));
    },
    setStateWH(obj) {
        this.setState(obj);
        this._state = Object.assign({}, this._state, obj);

    }
};

const Slide = React.createClass({
    mixins: [BaseComponent],
    _props: { source: "", className: "" },
    render() {
        return (
            <img src={this._props.source} width="200" className={this._props.className} />
        );
    }

});



const Controls2 = React.createClass({

    render() {
        return (
            <div>Ja perdole działa </div>
        );
    }

});



const Controls = React.createClass({
    _props: { currentSlide: 0, slidesCount: 0 },
    mixins: [BaseComponent],
    render() {
        const currentSlide = this._props.currentSlide,
            dotsArray = Array.apply(null, { length: this._props.slidesCount });


        const dots = dotsArray.map(function (_, index) {
            let className = "dot active-" + (currentSlide === index);
            return <div className={className}></div>;
        });
        return (
            <div id="dots">{dots} </div>
        );
    }

});


function SliderWrapper(Component) {
    return React.createClass({
        mixins: [BaseComponent],
        _state: { currentSlide: 0 },
        _props: { sources: [], children: {} },
        getInitialState() { return this._state },

        nextClicked(_) {
            var newCurrentSlide = (this._state.currentSlide + 1) % this._props.sources.length;
            this.setStateWH({ currentSlide: newCurrentSlide });
        },
        prevClicked(_) {
            var newCurrentSlide = (this._props.sources.length + this._state.currentSlide - 1) % this._props.sources.length;
            this.setStateWH({ currentSlide: newCurrentSlide });
        },
        render() {
            const currentSlide = this._state.currentSlide,
                slidesCount = this._props.sources.length;
            const slides = this._props.sources.map(function (imgPath, index) {
                let className = "active-" + (currentSlide === index);
                return <Slide source={imgPath} className={className} />;
            });

            return (
                <div id="slider">
                    <button onClick={this.prevClicked}>Prev</button>
                    <button onClick={this.nextClicked}>Next</button>
                    <div id="slides">{slides}</div>
                    <Component currentSlide={currentSlide} slidesCount={slidesCount} />

                </div>
            );
        }
    });
}

const App = React.createClass({
    displayName: "App",
    render() {
        const images = ["images/p1.jpg", "images/p2.jpg", "images/p3.jpg"];
        return (
            <div id="app">
                <Slider1 sources={images} />
            </div>

        );
    }
});

var Slider1 = SliderWrapper(Controls2);


ReactDOM.render(<App />, document.getElementById("main"));
