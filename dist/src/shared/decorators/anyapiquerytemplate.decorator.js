"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnyApiQueryTemplate = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
function AnyApiQueryTemplate(options) {
    return common_1.applyDecorators(swagger_1.ApiQuery(Object.assign({ name: 'query', type: Object, required: false, description: `<b>Here you can add any query string as you need for your query options, 
      But please follow the standard here</b> <a target="_blank" href="https://www.npmjs.com/package/mongoose-query-parser">https://www.npmjs.com/package/mongoose-query-parser</a>
      <ul>
      <li><b>Eg-Basic:</b> BASE_URL?limit=100&skip=0&page=1&email=test@gmail.com</li><br/>
      <li><b>Eg-Sort:</b> BASE_URL?limit=100&skip=0&page=1&sort=-createdAt (It accepts a comma-separated list of fields. Default behavior is to sort in ascending order. Use - prefixes to sort in descending order)</li><br/>
      <li><b>Eg-Partial Search with Rex:</b> BASE_URL?limit=100&skip=0&page=1&sort=-createdAt&contentFileName=/test1/i (For Reg expression checkout <a target="_blank" href="https://www.w3schools.com/jsref/jsref_obj_regexp.asp">Here</a></li><br/>
      <li>
      <b>Testing from swagger</b>
      <p>You need to send it as a object like below<p>
      <code>
      {
        "limit":100,
        "skip":0,
        "page":1,
        "contentFileName":"/test1/i",
        ...
        }
        </code>
      </li><br/>
      <li>
      <b>Eg-OR-Filter:</b> 
        <p>We can send Or query filter to our backend as follow,</p>
        <h5>For more advanced usage ($or, $type, $elemMatch, etc.), pass any MongoDB query filter object as JSON string in the filter query parameter, ie:</h5>
        <code>BASE_URL?filter={ "$or": [ { "name": { "$regex": "Sonic", "$options": "i" } }, { "streamingUrl": { "$regex": "Sonic", "$options": "i" } } ] }</code> <br/>
        <h2>OR</h2>
        <code>BASE_URL?filter={ "$or": [ { "name": "Sonic" }, { "streamingUrl": "Sonic" } ] }</code> <br/>
        <br/>
        <b>You can't test this king of query from swagger,Please use Postman Or Thunder Client</b>
        </li>
      </ul>
      ${(options === null || options === void 0 ? void 0 : options.additionalHtmlDescription) ? options.additionalHtmlDescription
            : ''}
      ` }, options === null || options === void 0 ? void 0 : options.apiQuery)));
}
exports.AnyApiQueryTemplate = AnyApiQueryTemplate;
//# sourceMappingURL=anyapiquerytemplate.decorator.js.map