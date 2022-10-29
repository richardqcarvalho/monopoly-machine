import styled from 'styled-components'
import colors from '../../styles/colors'

export const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${colors.primary};
  padding: 25px;
`

export const Title = styled.span`
  font-weight: 800;
  font-size: 28pt;
  word-break: break-word;
  text-align: center;
`

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

export const DropButton = styled.button`
  position: fixed;
  bottom: 10px;
  right: 10px;
  font-weight: 500;
  font-size: 7pt;
  word-break: break-word;
  text-align: center;
  padding: 10px;
  background-color: ${colors.danger};
  color: ${colors.contrast};
  margin: 10px 0;
  border: none;
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

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${colors.secondary};
  margin: 10px;
  padding: 10px;
  border-radius: 8px;
`

export const CardsContainer = styled.div`
  display: grid;
  grid-template-columns: 150px 150px;
`

export const TransfersContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${colors.contrast};
  border-radius: 8px;
  padding: 25px;
  max-height: 200px;
  overflow-x: hidden;
  margin: 10px 0;
  width: 280px;
`

export const Transfers = styled.span`
  color: ${colors.primaryDisabled};
  font-weight: 500;
  font-size: 10pt;
  word-break: break-word;
  text-align: center;
`

export const ErrorMessage = styled.span`
  color: ${colors.contrast};
  font-weight: 500;
  font-size: 8pt;
  word-break: break-word;
  text-align: center;
`

export const ErrorMessageWrapper = styled.div`
  background-color: ${colors.danger};
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 5px;
  border-radius: 8px;
`

export const TransferConfirmation = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${colors.secondary};
  margin: 10px;
  padding: 25px;
  border-radius: 8px;
  width: 280px;
  min-height: 280px;
`

export const AmountToSend = styled.span`
  color: ${colors.constrast};
  font-weight: 900;
  font-size: 24pt;
  word-break: break-word;
  text-align: center;
  margin-bottom: 10px;
`

export const PlayersAmount = styled.span`
  color: ${colors.contrast};
  font-weight: 500;
  font-size: 10pt;
  text-align: center;
  margin-bottom: 10px;
  margin-top: -5px;
`
