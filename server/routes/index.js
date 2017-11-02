import express from 'express';

const router = express.Router();

router.route('/')
  .get((req, res) => {
    res.render('layout');
  });

router.route('/convert?')
  .post(
    (req, res) => {
    const query = '/api/convert?input=' + req.body.number;
    res.redirect(query);
  })
  .get(
    (req, res, next) => {
      if (req.query.input === undefined) {
        return res.redirect('/');
      }
      const input = req.query.input.toLowerCase();
      if (Number.parseFloat(input) === NaN) {
        return res.render('layout', { message: "Please input a number."});
      }
      if ((/\//).test(input)) {
        input.match(/\//).length > 1
          ? res.render('layout', { message: "Invalid Number."})
          : "";
      }
      if ((/gal\.|gal(?!s)|gals|gals\.|gallon(?!s)|gallons|lb\.|lb(?!s)|lbs|lbs\.|pound(?!s)|pounds|mi\.|mi(?!l)|mile(?!s)|miles|l\.|l|liter(?!s)|liters|kg\.|kg(?!s)|kgs|kgs\.|kilogram(?!s)|kilograms|km|km(?!s)|kilometer(?!s)|kilometers/).test(input) === false) {
        return res.render('layout', { message: "Invalid Unit."});
      } else if (input.match(/gal\.|gal(?!s)|gals|gals\.|gallon(?!s)|gallons|lb\.|lb(?!s)|lbs|lbs\.|pound(?!s)|pounds|mi\.|mi(?!l)|mile(?!s)|miles|l\.|l|liter(?!s)|liters|kg\.|kg(?!s)|kgs|kgs\.|kilogram(?!s)|kilograms|km|km(?!s)|kilometer(?!s)|kilometers/g).length !== 1
      && Number.parseFloat(input) === NaN) {
        return res.render('layout', { message: "Invalid Number and Unit."});
      } else if (input.match(/gal\.|gal(?!s)|gals|gals\.|gallon(?!s)|gallons|lb\.|lb(?!s)|lbs|lbs\.|pound(?!s)|pounds|mi\.|mi(?!l)|mile(?!s)|miles|l\.|l|liter(?!s)|liters|kg\.|kg(?!s)|kgs|kgs\.|kilogram(?!s)|kilograms|km|km(?!s)|kilometer(?!s)|kilometers/g).length !== 1) {
        return res.render('layout', { message: "Invalid Unit."});
      }

      if ((/\//).test(input)) {
        const index = input.match(/\//).index;

        if ((/\./g).test(input.substr(0,index)) ) {
          input.substr(0,index).match(/\./g).length > 1
            ? res.render('layout', { message: "Invalid Number."})
            : "";
        }

        const firstNum = Number.parseFloat(input.substr(0,index));
        let tempString = input.substr(index + 1, 9999);

        if ((/\./g).test(tempString)) {
          tempString.match(/\./g).length > 1
            ? res.render('layout', { message: "Invalid Number."}) : "";
        }

        const secondNum = Number.parseFloat(tempString);
        const newNum = (firstNum / secondNum);
        tempString = input.match(/[a-zA-Z]/g).join('');
        const newString = `${newNum} ${tempString}`;
        req.newNum = newString;
        return next();
      } else {
        req.newNum = input;
        return next();
      }
    },
    (req, res) => {
      let inputString = req.newNum;
      let initNum = null;
      let initUnit = null;
      let returnNum = null;
      let returnUnit = null;
      let string = "";
      const liter = 3.78541;
      const kg = 0.453592;
      const km = 1.60934;

      function rounding(num) {
        let testNum = num;
        let tempStr = null;
        if ((/\./).test(testNum.toString())) {
          let index = testNum.toString().match(/\./).index;
          tempStr = testNum.toString().substr(index, 999);
        } else {
          return testNum;
        }
        if (tempStr.match(/[0-9]/g).length > 5) {
          return testNum.toFixed(5);
        }
        return testNum;
      }

      if ((/gal\.|gal(?!s)|gals|gals\.|gallon(?!s)|gallons/).test(inputString)) {
        initNum = rounding(Number.parseFloat(inputString));
        returnNum = rounding(initNum * liter);
        string = `${initNum} gal/s converts to ${returnNum} liter/s`;
        res.render('layout', {
          message: string,
          converter: JSON.stringify({
            initNum: initNum,
            initUnit: "gal/s",
            returnNum: returnNum,
            returnUnit: "liter/s",
            string: string
            })
          }
        );
      }

      if ((/lb\.|lb(?!s)|lbs|lbs\.|pound(?!s)|pounds/).test(inputString)) {
        initNum = rounding(Number.parseFloat(inputString));
        returnNum = rounding(initNum * kg);
        string = `${initNum} lb/s converts to ${returnNum} kg/s`;
        res.render('layout', {
          message: string,
          converter: JSON.stringify({
            initNum: initNum,
            initUnit: "lb/s",
            returnNum: returnNum,
            returnUnit: "kg/s",
            string: string
            })
          }
        );
      }

      if ((/mi\.|mi(?!l)|mile(?!s)|miles/).test(inputString)) {
        initNum = rounding(Number.parseFloat(inputString));
        returnNum = rounding(initNum * km);
        string = `${initNum} miles converts to ${returnNum} kilometers`;
        res.render('layout', {
          message: string,
          converter: JSON.stringify({
            initNum: initNum,
            initUnit: "mi",
            returnNum: returnNum,
            returnUnit: "km",
            string: string
            })
          }
        );
      }

      if ((/l\.|l|liter(?!s)|liters/).test(inputString)) {
        initNum = rounding(Number.parseFloat(inputString));
        returnNum = rounding(initNum / liter);
        string = `${initNum} liter/s converts to ${returnNum} gal/s`;
        res.render('layout', {
          message: string,
          converter: JSON.stringify({
            initNum: initNum,
            initUnit: "liter/s",
            returnNum: returnNum,
            returnUnit: "gal/s",
            string: string
            })
          }
        );
      }

      if ((/kg\.|kg(?!s)|kgs|kgs\.|kilogram(?!s)|kilograms/).test(inputString)) {
        initNum = rounding(Number.parseFloat(inputString));
        returnNum = rounding(initNum / kg);
        string = `${initNum} kg/s converts to ${returnNum} lb/s`;
        res.render('layout', {
          message: string,
          converter: JSON.stringify({
            initNum: initNum,
            initUnit: "kg/s",
            returnNum: returnNum,
            returnUnit: "lb/s",
            string: string
            })
          }
        );
      }

      if ((/km|km(?!s)|kilometer(?!s)|kilometers/).test(inputString)) {
        initNum = rounding(Number.parseFloat(inputString));
        returnNum = rounding(initNum / km);
        string = `${initNum} kilometer/s converts to ${returnNum} mile/s`;
        res.render('layout', {
          message: string,
          converter: JSON.stringify({
            initNum: initNum,
            initUnit: "km",
            returnNum: returnNum,
            returnUnit: "mi",
            string: string
            })
          }
        );
      }

  });

export default router;
