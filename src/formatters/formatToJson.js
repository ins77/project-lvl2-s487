import types from '../types';

const getNodeValue = ({ type, previousValue, currentValue }) => (
  type === types.changed
    ? { previous: previousValue, current: currentValue }
    : currentValue
);

const getNode = (tree, buildFn) => {
  const {
    key,
    type,
    children,
  } = tree;

  return type === types.nested
    ? { [key]: { type, children: buildFn(children) } }
    : { [key]: { type, value: getNodeValue(tree) } };
};

const build = trees => (
  trees.reduce((acc, tree) => ({ ...acc, ...getNode(tree, build) }), {})
);

export default trees => JSON.stringify(build(trees), null, 2);
