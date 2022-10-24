import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #26a8df;
  padding: 25px;
`

export const Title = styled.span`
  font-weight: 800;
  font-size: 28pt;
  margin: 10px 0;
`

export const Message = styled.span`
  font-weight: 500;
  font-size: 14pt;
  margin: 10px 0 -10px 0;
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
`

export const DropButton = styled.button`
  position: absolute;
  bottom: 20px;
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
  width: 100%;
`
