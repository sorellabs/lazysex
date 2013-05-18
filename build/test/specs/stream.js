(function(){
  var spec, expect, ref$, Stream, Nothing;
  spec = require('brofist')();
  expect = require('chai').expect;
  ref$ = require('../../lib/stream'), Stream = ref$.Stream, Nothing = ref$.Nothing;
  module.exports = spec('{} Stream', function(it, spec){
    var one, two, ones;
    one = Stream.make(1, function(){
      return Nothing;
    });
    two = Stream.make(2, function(){
      return one;
    });
    ones = Stream.make(1);
    ones.tail = function(){
      return ones;
    };
    spec('init(a, b)', function(it){
      return it('Should produce a value matching Stream structure', function(){
        expect(one.head).to.equal(1);
        return expect(two.tail().head).to.equal(1);
      });
    });
    spec('to-string()', function(it){
      return it('Should produce a textual representation of the stream.', function(){
        return expect(two.toString()).to.equal('<Stream 2:<Stream 1:(Nothing)>>');
      });
    });
    spec('concat(bs)', function(it){
      it('If the left stream is empty, should return the right.', function(){
        return expect(Nothing.concat(one)).to.equal(one);
      });
      it('If the right stream is empty, should return the left.', function(){
        return expect(one.concat(Nothing)).to.equal(one);
      });
      it('Should return the left stream, followed by the right stream.', function(){
        return expect(one.concat(one).toString()).to.equal('<Stream 1:<Stream 1:(Nothing)>>');
      });
      return it('Should concatenate things lazily.', function(){
        return expect(ones.tail().head).to.equal(1);
      });
    });
    spec('empty()', function(it){
      return it('Should return a new empty stream.', function(){
        return expect(Stream.empty()).to.equal(Nothing);
      });
    });
    spec('map(f)', function(it){
      it('Should return a new Stream with every item transformed by `f`.', function(){
        var double;
        double = two.map((function(it){
          return it * 2;
        }));
        return expect(double.toString()).to.equal('<Stream 4:<Stream 2:(Nothing)>>');
      });
      return it('Should be lazy.', function(){
        var twos;
        twos = ones.map((function(it){
          return it + 1;
        }));
        return expect(twos.tail().head).to.equal(2);
      });
    });
    spec('chain(f)', function(it){
      return it('Should transform a Stream`s head value.', function(){
        var two;
        two = one.chain(function(a){
          return Stream.of(a + 1);
        });
        return expect(two.head).to.equal(2);
      });
    });
    spec('of(a)', function(it){
      return it('Should create a new Stream with the given head.', function(){
        return expect(Stream.of(1).head).to.equal(1);
      });
    });
    spec('reduce-right(f, a)', function(it){
      it('Folding an empty list should return the initial value.', function(){
        return expect(Nothing.reduceRight((function(it){
          return it + 1;
        }), 0)).to.equal(0);
      });
      it('Should apply f to the first value, and the result of the rest.', function(){
        var sum;
        sum = two.reduceRight(curry$(function(x$, y$){
          return x$ + y$;
        }), 0);
        return expect(sum).to.equal(3);
      });
      return it('Should be right-associative.', function(){
        var as;
        as = two.reduceRight(function(a, b){
          return [a, b];
        }, []);
        return expect(as).to.deep.equal([2, [1, []]]);
      });
    });
    return spec('reduce(f, a)', function(it){
      it('Folding an empty list should return the initial value.', function(){
        return expect(Nothing.reduce((function(it){
          return it + 1;
        }), 0)).to.equal(0);
      });
      it('Should apply f to the first value, and the result of the rest.', function(){
        var sum;
        sum = two.reduce(curry$(function(x$, y$){
          return x$ + y$;
        }), 0);
        return expect(sum).to.equal(3);
      });
      return it('Should be left associative.', function(){
        var as;
        as = two.reduce(function(a, b){
          return [a, b];
        }, []);
        return expect(as).to.deep.equal([[2, []], 1]);
      });
    });
  });
  function curry$(f, bound){
    var context,
    _curry = function(args) {
      return f.length > 1 ? function(){
        var params = args ? args.concat() : [];
        context = bound ? context || this : this;
        return params.push.apply(params, arguments) <
            f.length && arguments.length ?
          _curry.call(context, params) : f.apply(context, params);
      } : f;
    };
    return _curry();
  }
}).call(this);
