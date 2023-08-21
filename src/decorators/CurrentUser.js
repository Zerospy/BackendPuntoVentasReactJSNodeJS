const { createParamDecorator } = require("routing-controllers");

function CurrentUser() {
  return createParamDecorator({
    value: action => {
      const { token: { userid = undefined } = {} } = action.request;
      return userid;
    }
  });
}
