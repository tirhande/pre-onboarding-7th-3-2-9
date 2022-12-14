import { useRouter } from 'next/router';
import { useRecoilState } from 'recoil';

import { Formik } from 'formik';
import styled from 'styled-components';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';

import { BROKERS, ACCOUNT_STATUS } from 'utils/DataEnum';
import { queriesState } from 'core/states';
import { getAccountPath } from 'utils/AccountPath';
import { IAccountFilter } from 'core/services/types';
import { useState } from 'react';
import ConfirmDialog from 'components/blocks/ConfirmDialog';
import CreateAccount from 'components/blocks/CreateAccount';

const AccountFilterBar = () => {
  const router = useRouter();
  const [queries, setQueries] = useRecoilState(queriesState);
  const { broker = '', active = '', status = '', q = '' } = router.query;

  const [createOpen, setCreateOpen] = useState(false);

  const onFilterSubmit = (values: IAccountFilter) => {
    setQueries({ ...queries, page: 1, ...values });
    router.push(getAccountPath({ ...queries, page: 1, ...values }), undefined, { shallow: true });
  };

  const createDialogClose = () => {
    setCreateOpen(false);
  };

  return (
    <>
      <StyledFilterDiv>
        <Formik
          initialValues={{
            broker: queries.broker ? queries.broker : broker.toString(),
            active: queries.active ? queries.active : active.toString(),
            status: queries.status ? queries.status : status.toString(),
            q: queries.q ? queries.q : q.toString(),
          }}
          onSubmit={(values, { setSubmitting }) => {
            onFilterSubmit(values);
            setSubmitting(false);
          }}
        >
          {({ values, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
            <StyledFilterForm onSubmit={handleSubmit}>
              <FormControl sx={{ m: 1, minWidth: 170 }} size="small">
                <InputLabel>????????????</InputLabel>
                <Select
                  name="broker"
                  value={values.broker}
                  label="??????"
                  onChange={handleChange}
                  MenuProps={{ style: { maxHeight: '300px' } }}
                >
                  <MenuItem value="">
                    <em>??????</em>
                  </MenuItem>
                  {Object.keys(BROKERS).map((key, index) => {
                    return (
                      <MenuItem key={index} value={key}>
                        {BROKERS[key]}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              <FormControl sx={{ m: 1, minWidth: 150 }} size="small">
                <InputLabel>?????? ????????? ??????</InputLabel>
                <Select name="active" value={values.active} onChange={handleChange} displayEmpty>
                  <MenuItem value="">
                    <em>??????</em>
                  </MenuItem>
                  <MenuItem value={'true'}>??????</MenuItem>
                  <MenuItem value={'false'}>?????????</MenuItem>
                </Select>
              </FormControl>
              <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                <InputLabel>?????? ??????</InputLabel>
                <Select name="status" value={values.status} onChange={handleChange} displayEmpty>
                  <MenuItem value="">
                    <em>??????</em>
                  </MenuItem>
                  {Object.keys(ACCOUNT_STATUS).map((key, index) => {
                    return (
                      <MenuItem key={index} value={key}>
                        {ACCOUNT_STATUS[key]}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                <TextField
                  name="q"
                  label="?????????"
                  value={values.q}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  size="small"
                />
              </FormControl>
              <Button variant="contained" type="submit" color="info" disabled={isSubmitting}>
                ??????
              </Button>
            </StyledFilterForm>
          )}
        </Formik>
        <Button variant="contained" onClick={() => setCreateOpen(true)}>
          ?????? ??????
        </Button>
      </StyledFilterDiv>
      <ConfirmDialog
        open={createOpen}
        dialogClose={createDialogClose}
        title="?????? ??????"
        contents={<CreateAccount dialogClose={createDialogClose} />}
        buttons={[]}
      />
    </>
  );
};

const StyledFilterDiv = styled.div`
  display: flex;
  justify-content: flex-end;

  button {
    height: 36px;
    margin: 10px;
  }
`;
const StyledFilterForm = styled.form`
  display: flex;
  overflow-x: auto;
`;

export default AccountFilterBar;
