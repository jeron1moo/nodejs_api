// import _ from 'lodash';

// const slugify = (text: string) => _.kebabCase(text);

// async function createUniqueSlug(Model: string, slug: string, count: string) {
//   const user = await Model.findOne({ slug: `${slug}-${count}` }, 'id');

//   if (!user) {
//     return `${slug}-${count}`;
//   }

//   return createUniqueSlug(Model, slug, count + 1);
// }

// async function generateSlug(Model: string, name: string, filter: any = {}) {
//   const origSlug = slugify(name);

//   const user = await Model.findOne({ slug: origSlug, ...filter }, 'id');

//   if (!user) {
//     return origSlug;
//   }

//   return createUniqueSlug(Model, origSlug, 1);
// }

// module.exports = generateSlug;
