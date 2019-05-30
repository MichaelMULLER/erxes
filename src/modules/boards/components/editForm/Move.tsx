import { BoardSelect } from 'modules/boards/containers';
import { IStage } from 'modules/boards/types';
import { Icon, Tip } from 'modules/common/components';
import {
  MoveContainer,
  MoveFormContainer,
  PipelineName,
  StageItem,
  Stages
} from 'modules/deals/styles/deal';
import * as React from 'react';
import { Item } from '../../types';

type Props = {
  item?: Item;
  stages: IStage[];
  stageId?: string;
  onChangeStage?: (stageId: string) => void;
  type: string;
};

type State = {
  boardId: string;
  pipelineId: string;
  show: boolean;
  stages: IStage[];
};

class Move extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    const {
      item: { pipeline, boardId }
    } = props;

    this.state = {
      show: false,
      stages: props.stages || [],
      pipelineId: pipeline && pipeline._id,
      boardId
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.stages !== nextProps.stages) {
      this.setState({ stages: nextProps.stages });
    }
  }

  onChangeBoard = (boardId: string) => {
    this.setState({ boardId });
  };

  onChangePipeline = (pipelineId: string, stages: IStage[]) => {
    this.setState({ pipelineId, stages });
  };

  toggleForm = () => {
    this.setState({ show: !this.state.show });
  };

  renderStages() {
    const { stageId, onChangeStage } = this.props;
    const { stages } = this.state;

    let isPass = true;

    return (
      <Stages>
        {stages.map(s => {
          const onClick = () => onChangeStage && onChangeStage(s._id);

          const item = (
            <StageItem key={s._id} isPass={isPass}>
              <Tip text={s.name}>
                <a onClick={onClick}>
                  <Icon icon="checked-1" />
                </a>
              </Tip>
            </StageItem>
          );

          if (s._id === stageId) {
            isPass = false;
          }

          return item;
        })}
      </Stages>
    );
  }

  renderBoardSelect() {
    if (!this.state.show) {
      return null;
    }

    const { stageId, onChangeStage, type } = this.props;
    const { boardId, pipelineId } = this.state;

    return (
      <BoardSelect
        type={type}
        stageId={stageId}
        boardId={boardId}
        pipelineId={pipelineId}
        callback={this.toggleForm}
        onChangeStage={onChangeStage}
        onChangePipeline={this.onChangePipeline}
        onChangeBoard={this.onChangeBoard}
      />
    );
  }

  render() {
    const item = this.props.item || ({} as Item);
    const { pipeline } = item;

    return (
      <MoveContainer>
        <MoveFormContainer>
          <PipelineName onClick={this.toggleForm}>
            {pipeline && pipeline.name} <Icon icon="downarrow" size={10} />
          </PipelineName>

          {this.renderBoardSelect()}
        </MoveFormContainer>

        {this.renderStages()}
      </MoveContainer>
    );
  }
}

export default Move;
