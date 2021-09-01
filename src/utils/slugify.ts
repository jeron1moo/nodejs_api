import _ from 'lodash';

const slugify = (text: string) => _.kebabCase(text);

async function createUniqueSlug(
  Model: any,
  slug: string,
  count: string,
): Promise<string | any> {
  const user = await Model.findOne({ slug: `${slug}-${count}` }, 'id');

  if (!user) {
    return `${slug}-${count}`;
  }

  return createUniqueSlug(Model, slug, count + '1');
}

async function generateSlug(Model: any, name: string): Promise<string | any> {
  const origSlug = slugify(name);

  const user = await Model.findOne({ slug: origSlug }, 'id');

  if (!user) {
    return origSlug;
  }

  return createUniqueSlug(Model, origSlug, '1');
}

export default generateSlug;
