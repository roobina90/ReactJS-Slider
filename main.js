
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
            <img src={this._props.source} className={this._props.className} />
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
        //mixins: [BaseComponent],
        _state: { currentSlide: 0 },
        _props: { sources: [], children: {} },
        getInitialState() { return this._state },
        moveRight: false,
        moveLeft: false,
        slides: [],
        prev: 3,
        next: -1,
        componentWillMount() {
            this.slides = this.props.sources.map(function (imgPath, index) {
                //let className = "active-" + (currentSlide === index);
                return <Slide source={imgPath} />;
            });
        },
        nextClicked(_) {
           var newCurrentSlide = (this.state.currentSlide + 1) % this.props.sources.length;
            this.moveLeft = false;
            this.moveRight = true;
            this.setState({ currentSlide: newCurrentSlide });

        },
        prevClicked(_) {
            var newCurrentSlide = (this.props.sources.length + this.state.currentSlide - 1) % this.props.sources.length;
            this.moveRight = false;
            this.moveLeft = true;
            this.setState({ currentSlide: newCurrentSlide });
        },
        getPrev() {
            return (this.prev - 1 < 0 ) ? this.prev = this.props.sources.length - 1 : this.prev = this.prev - 1;
        },
        getNext() {
            return (this.next + 1 === this.props.sources.length ) ? this.next = 0 : this.next = this.next + 1;
        },
        render() {
            console.log(this.slides);
            const currentSlide = this.state.currentSlide,
                slidesCount = this.props.sources.length;
            // const slides = this.props.sources.map(function (imgPath, index) {
            //     //let className = "active-" + (currentSlide === index);
            //     return <Slide source={imgPath} />;
            // });
            var aaa = [];
            if (this.moveRight) {
                let index = this.getNext();
                console.log("przenosze na koniec slajd numer " + index);
                this.slides = [...this.slides, <Slide source={this.props.sources[index]} />];
            } else if (this.moveLeft) {
                let index =this.getPrev();
                console.log("przenosze na początek slajd numer " + index + "current slide to "+ currentSlide);
                this.slides = [<Slide source={this.props.sources[index]} />, ...this.slides];
            }
            const leftPadding =0 ;// -1 * currentSlide * 200;
            return (
                <div id="slider">
                    <button onClick={this.prevClicked}>Prev</button>
                    <button onClick={this.nextClicked}>Next</button>
                    <div id="slides" style={{ left: leftPadding }}>{this.slides}</div>
                    <Component currentSlide={currentSlide} slidesCount={slidesCount} />

                </div>
            );
        }
    });
}

const App = React.createClass({
    displayName: "App",
    render() {
        const images = ["http://www.celebritynetworth123.com/wp-content/plugins/networthdisplay/cnwimages/s/sasha-grey.jpg", "images/p2.jpg", "http://www.royalcanin.ca/~/media/Royal-Canin-Canada/Product-Categories/cat-adult-landing-hero.ashx"];
        return (
            <div id="app">
                <Slider1 sources={images} />
            </div>

        );
    }
});

var Slider1 = SliderWrapper(Controls);


ReactDOM.render(<App />, document.getElementById("main"));
