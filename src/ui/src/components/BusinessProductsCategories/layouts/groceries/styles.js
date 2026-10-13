import styled, { css } from 'styled-components'

export const CategoriesWrap = styled.div`
  display: flex;
  width: 100%;
  border-radius: 10px;

  ${({ avoidAllLevelsSubCategories }) => !avoidAllLevelsSubCategories && css`
    flex-direction: column;
    border: 1px solid #ccc;

    @media (min-width: 993px) {
      overflow: hidden;
      max-height: calc(90vh - 10px);
      border: 0;
    }
  `}
  ${({ avoidAllLevelsSubCategories }) => avoidAllLevelsSubCategories && css`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 40px;
  `}
`

export const CategoriesContainer = styled.div`
  display: flex;
  padding-bottom: 0;
  background: ${props => props.theme.colors.backgroundPage};
  z-index: 1000;
  text-align: center;
  padding: 15px 0 0 0;

  ${({ avoidAllLevelsSubCategories }) => !avoidAllLevelsSubCategories && css`
    overflow-x: auto;
    width: 100%;
    top: 45px;
    position: sticky;
  `}
  div.category {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  div.special {
    ${props => !props.featured && css`
      display: none;
    `}
  }

  @media (min-width: 993px) {
    padding: 0;
  }
`

export const CategoryTab = styled.div`
  padding: 10px 15px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: ${props => props.categorySpace ?? 0}px;
  text-align: left;
  border-bottom: ${({ isSub, avoidAllLevelsSubCategories }) => !avoidAllLevelsSubCategories && !isSub ? '1px solid #ccc' : ''};
  span {
    width: 90%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  ${({ active }) => active && css`
    color: ${props => props.theme.colors.primaryContrast};
    background-color: ${props => props.theme.colors.primary};
  `}

  ${({ avoidAllLevelsSubCategories }) => avoidAllLevelsSubCategories && css`
    display: flex;
    flex-direction: column;
    min-height: 275px;
    justify-content: center;

    div {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: ${props => props.theme.colors.primary};
      padding: 10px 0px 10px;
      min-height: 45px;
      border-radius: 0px 0px 20px 20px;
    }

    span {
      white-space: normal;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      width: 100%;
      text-align: center;
      font-size: ${({ theme }) => theme?.utils?.tsize?.l}px;
      font-weight: 600;
      color: ${props => props.theme.colors.primaryContrast};
      padding: 0 10px;
    }

    img {
      min-height: min-content;
      width: 100%;
      height: 200px;
      border-radius: 20px 20px 0px 0px;

      @media (min-width: 588px) {
        min-height: unset;
      }
    }
  `}
`

export const IterateCategoriesContainer = styled.div`
  div.level-1 {
    border-bottom: ${({ isSub }) => !isSub ? '1px solid #ccc' : ''} !important;
  }
`
