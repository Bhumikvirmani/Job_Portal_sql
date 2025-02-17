// import DataUriParser from "datauri/parser.js"

// import path from "path";

// const getDataUri = (file) => {
//     const parser = new DataUriParser();
//     const extName = path.extname(file.originalname).toString();
//     return parser.format(extName, file.buffer);
// }

// export default getDataUri;

// import DataURIParser from 'datauri';
// import path from 'path';

// const parser = new DataURIParser();

// const getDataUri = (file) => {
//     const extName = path.extname(file.originalname).toString();
//     return parser.format(extName, file.buffer).content;
// };

// export default getDataUri;

// import DataUriParser from "datauri/parser.js"

// import path from "path";

// const getDataUri = (file) => {
//     const parser = new DataUriParser();
//     const extName = path.extname(file.originalname).toString();
//     return parser.format(extName, file.buffer);
// }

// export default getDataUri;
import DataURIParser from 'datauri';
import path from 'path';

const parser = new DataURIParser();

const getDataUri = (file) => {
    const extName = path.extname(file.originalname).toString();
    const dataUri = parser.format(extName, file.buffer);
    return dataUri.content;
};

export default getDataUri;


