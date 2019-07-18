import statuses from '../statuses';

const getNodeValue = ({ status, previousValue, currentValue }) => (
  status === statuses.changed
    ? { previous: previousValue, current: currentValue }
    : currentValue
);

const getNode = (tree, buildFn) => {
  const {
    key,
    status,
    children,
  } = tree;

  return status === statuses.unchanged && children !== undefined
    ? { [key]: { status, children: buildFn(children) } }
    : { [key]: { status, value: getNodeValue(tree) } };
};

const build = trees => (
  trees.reduce((acc, tree) => ({ ...acc, ...getNode(tree, build) }), {})
);

export default trees => JSON.stringify(build(trees), null, 2);
