import styled from 'styled-components'
import colors from '../../styles/colors'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${({ color }) => color || colors.secondary};
  padding: 25px;
  border-radius: 8px;
  width: 80vw;
  height: 40vh;
  position: fixed;
  top: 30vh;
  left: 10vw;
  box-shadow: 0px 0px 5px;
  backdrop-filter: blur(50px);
`

export const AmountToSend = styled.span`
  color: ${colors.constrast};
  font-weight: 900;
  font-size: 24pt;
  word-break: break-word;
  text-align: center;
  margin-bottom: 10px;
`

export const ErrorMessageWrapper = styled.div`
  background-color: ${colors.danger};
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 5px;
  border-radius: 8px;
`

export const Input = styled.input`
  border: none;
  padding: 15px;
  background-color: #fff;
  color: ${colors.secondary};
  border-radius: 8px;
  :focus {
    outline: none;
  }
  margin: 10px 0;
  text-align: center;
  font-size: 12pt;
  word-break: break-word;
  text-align: center;
  font-weight: 500;
  ::placeholder {
    color: ${colors.contrastDisabled};
  }
  width: 100%;
`

export const Button = styled.button`
  font-weight: 500;
  font-size: 12pt;
  word-break: break-word;
  text-align: center;
  padding: 15px;
  background-color: ${colors.contrast};
  color: ${colors.secondary};
  margin: 10px 0;
  border: none;
  border-radius: 8px;
  width: 100%;
  :disabled {
    background-color: ${colors.primaryDisabled};
    color: ${colors.contrastDisabled};
  }
`

export const Message = styled.span`
  font-weight: 500;
  font-size: 14pt;
  word-break: break-word;
  text-align: center;
  margin: 10px 0;
`

export const ErrorMessage = styled.span`
  color: ${colors.contrast};
  font-weight: 500;
  font-size: 8pt;
  word-break: break-word;
  text-align: center;
`
