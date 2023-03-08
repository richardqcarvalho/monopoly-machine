import styled from 'styled-components'
import colors from '../../styles/colors'

export const Message = styled.span`
  font-weight: 500;
  font-size: 14pt;
  word-break: break-word;
  text-align: center;
  margin: 10px 0;
`
export const Button = styled.button`
  font-weight: 500;
  font-size: 12pt;
  word-break: break-word;
  text-align: center;
  padding: 15px;
  background-color: ${({ backgroundColor }) => backgroundColor};
  color: ${({ color }) => color};
  margin: 10px 0;
  border: none;
  border-radius: 8px;
  width: 100%;
  /* height: 100%; */
  :disabled {
    background-color: ${colors.primaryDisabled};
    color: ${colors.contrastDisabled};
  }
`
export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${({ toBank }) =>
    toBank ? colors.danger : colors.secondary};
  margin: 10px;
  padding: 10px;
  border-radius: 8px;
`
export const PlayersAmount = styled.span`
  color: ${colors.contrast};
  font-weight: 500;
  font-size: 10pt;
  text-align: center;
  margin-bottom: 10px;
`
