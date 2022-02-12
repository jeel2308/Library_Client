import { useEffect } from 'react';
import { connect } from 'react-redux';
import { useQuery } from '@apollo/client';
import { setToastMessage } from '../../modules/Module';

const withQuery = (query, configuration) => (WrappedComponent) => {
  const WithQuery = (props) => {
    const { setToastMessage, ...otherProps } = props;

    const {
      name,
      fetchPolicy,
      getVariables,
      getSkipQueryStatus,
      mapQueryDataToProps,
      updateQuery,
    } = configuration;

    const variables = getVariables(otherProps);

    const skip = getSkipQueryStatus?.(otherProps) ?? false;

    const { loading, data, error, ...rest } = useQuery(query, {
      fetchPolicy: fetchPolicy ?? 'cache-and-network',
      skip,
      variables,
      updateQuery,
    });

    useEffect(() => {
      if (error) {
        setToastMessage({
          title: 'Something went wrong',
          isClosable: true,
          position: 'bottom-left',
          status: 'error',
        });
      }
    }, [error]);

    const queryDataProps = mapQueryDataToProps({
      [name ? name : 'data']: data,
      ownProps: otherProps,
    });

    if (loading) {
      return <div>Loading</div>;
    }
    if (error) {
      return null;
    }
    return <WrappedComponent {...otherProps} {...queryDataProps} />;
  };

  const mapActionCreators = {
    setToastMessage,
  };

  WithQuery.displayName = configuration.displayName;

  return connect(null, mapActionCreators)(WithQuery);
};

export default withQuery;
