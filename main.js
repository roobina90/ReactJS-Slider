
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
    //_props: { currentSlide: 0, slidesCount: 0, setSlide: {} },
    //mixins: [BaseComponent],
    render() {
        const currentSlide = this.props.currentSlide,
            dotsArray = Array.apply(null, { length: this.props.slidesCount }),
            func = this.props.setSlide;
        const dots = dotsArray.map(function (_, index) {
            let className = "dot active-" + (currentSlide === index);
            return <div className={className} onClick={func.bind(null, index + 1)}></div>;
        });
        return (
            <div id="dots">{dots} </div>
        );
    }

});


function SliderWrapper(Component) {
    return React.createClass({
        //mixins: [BaseComponent],
        _state: { currentSlide: 1 },
        _props: { sources: [], children: {}, left: -200, anim: true },
        getInitialState() { return this._state },
        //moveRight: false,
        //moveLeft: false,
        slides: [],
        //prev: 3,
        //next: -1,
        componentWillMount() {
            this.slides = this.props.sources.map(function (imgPath, index) {
                //let className = "active-" + (currentSlide === index);
                return <Slide source={imgPath} />;
            });
            this.slides = [<Slide source={this.props.sources[this.slides.length-1]} />, ...this.slides, <Slide source={this.props.sources[0]} />]
        },
        nextClicked(_) {
            var newCurrentSlide = this.state.currentSlide + 1;
            
            // if(newCurrentSlide % this.props.sources.length === 0 ) {
            //     this.slides = [...this.slides, ...this.slides];
            // }
        //     if(this.state.currentSlide + 1 > this.props.sources.length) {

        //     }
           var newCurrentSlide = (this.state.currentSlide > this.props.sources.length) ? 2 : this.state.currentSlide + 1;
            console.log("nie ma cyklu stan " + newCurrentSlide);
           //((this.state.currentSlide + 1) % this.props.sources.length) + 1;
            // this.moveLeft = false;
            // this.moveRight = true;
            this.setState({ currentSlide: newCurrentSlide, left: -200 * newCurrentSlide, anim: true });
            if (newCurrentSlide > this.props.sources.length) {
                
                setTimeout(function() {
                    this.setState({currentSlide: 1, left: -200, anim : false})
                    console.log("był cykl  " + this.state.currentSlide);
                }.bind(this), 200);
            }

        },
        setNthSlide(i) {
            console.log(i);
            this.setState({currentSlide: i, left: -200 * i});
        },
        prevClicked(_) {
            //var newCurrentSlide = this.state.currentSlide - 1;
            // if((newCurrentSlide * (-1)) % this.props.sources.length) {
            //     this.slides = [...this.slides, ...this.slides];
            // }
            var newCurrentSlide = this.state.currentSlide - 1 < 0 ? this.props.sources.length - 1 : this.state.currentSlide - 1;
            console.log("nie ma cyklu stan " + newCurrentSlide);
            //((this.props.sources.length + this.state.currentSlide - 1) % this.props.sources.length) + 1;
            // this.moveRight = false;
            // this.moveLeft = true;
            this.setState({ currentSlide: newCurrentSlide, left: -200 * newCurrentSlide, anim: true});
            if (newCurrentSlide === 0) {
                
                setTimeout(function() {
                    this.setState({currentSlide: this.props.sources.length, left: -200 * this.props.sources.length, anim : false})
                     console.log("był cykl  " + this.state.currentSlide);
                }.bind(this), 200);
            }
        },
        // getPrev() {
        //     return (this.prev - 1 < 0 ) ? this.prev = this.props.sources.length - 1 : this.prev = this.prev - 1;
        // },
        // getNext() {
        //     return (this.next + 1 === this.props.sources.length ) ? this.next = 0 : this.next = this.next + 1;
        // },
        render() {
            const currentSlide = this.state.currentSlide,
                slidesCount = this.props.sources.length;
            // const slides = this.props.sources.map(function (imgPath, index) {
            //     //let className = "active-" + (currentSlide === index);
            //     return <Slide source={imgPath} />;
            // });
            //var aaa = [];
            // if (this.moveRight) {
            //     let index = this.getNext();
            //     console.log("przenosze na koniec slajd numer " + index);
            //     this.slides = [...this.slides, <Slide source={this.props.sources[index]} />];
            // } else if (this.moveLeft) {
            //     let index =this.getPrev();
            //     console.log("przenosze na początek slajd numer " + index + "current slide to "+ currentSlide);
            //     this.slides = [<Slide source={this.props.sources[index]} />, ...this.slides];
            // }
            //const leftPadding =-200 * (currentSlide) ;// -1 * currentSlide * 200;
            //console.log(leftPadding);
            var classN = "anim-" + this.state.anim;
            return (
                <div id="slider">
                    <div id="slides" className ={classN} style={{ left: this.state.left }}>{this.slides}</div>
                    <button onClick={this.prevClicked}>Prev</button>
                    <button onClick={this.nextClicked}>Next</button>
                    <Component currentSlide={currentSlide-1} slidesCount={slidesCount} setSlide ={this.setNthSlide} />

                </div>
            );
        }
    });
}

const App = React.createClass({
    displayName: "App",
    render() {
        const images = ["http://www.celebritynetworth123.com/wp-content/plugins/networthdisplay/cnwimages/s/sasha-grey.jpg", "images/p2.jpg", "http://www.royalcanin.ca/~/media/Royal-Canin-Canada/Product-Categories/cat-adult-landing-hero.ashx", "https://cms-assets.tutsplus.com/uploads/users/45/posts/20903/preview_image/gulp-preview.png"];
        return (
            <div id="app">
                <Slider1 sources={images} />
            </div>

        );
    }
});

var Slider1 = SliderWrapper(Controls);


ReactDOM.render(<App />, document.getElementById("main"));
