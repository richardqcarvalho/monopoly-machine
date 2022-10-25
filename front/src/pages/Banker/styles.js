import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #3498db;
  padding: 25px;
`

export const Title = styled.span`
  font-weight: 800;
  font-size: 28pt;
`

export const Message = styled.span`
  font-weight: 500;
  font-size: 14pt;
  margin: 10px 0;
`

export const Button = styled.button`
  font-weight: 500;
  font-size: 12pt;
  padding: 15px;
  background-color: #fff;
  color: #26a8df;
  margin: 10px 0;
  border: none;
  border-radius: 8px;
  width: 100%;
`

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #2980b9;
  margin: 10px;
  padding: 10px;
  border-radius: 8px;
`

export const CardsContainer = styled.div`
  display: grid;
  grid-template-columns: 150px 150px;
`

export const DropButton = styled.button`
  position: fixed;
  bottom: 10px;
  right: 10px;
  font-weight: 500;
  font-size: 7pt;
  padding: 10px;
  background-color: #c0392b;
  color: #fff;
  margin: 10px 0;
  border: none;
  border-radius: 8px;
`

export const Input = styled.input`
  border: none;
  padding: 15px;
  background-color: #fff;
  color: #26a8df;
  border-radius: 8px;
  :focus {
    outline: none;
  }
  margin: 10px 0;
  width: 260px;
  text-align: center;
  font-size: 12pt;
  font-weight: 500;
`

export const TransfersContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: end;
  background-color: #fff;
  border-radius: 8px;
  padding: 25px;
  max-height: 200px;
  overflow-x: hidden;
  margin: 10px 0;
  width: 280px;
`

export const Transfers = styled.span`
  color: #000;
  font-weight: 500;
  font-size: 10pt;
`
