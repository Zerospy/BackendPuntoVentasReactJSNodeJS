const { createParamDecorator } = require("routing-controllers");

function PaginationInfo() {
  return createParamDecorator({
    value: action => {
      const perPage = action.request.query["per_page"] || 50;
      const pageNo = action.request.query["page"] || 1;

      const info = {
        perPage,
        pageNo
      };

      return info;
    }
  });
}
