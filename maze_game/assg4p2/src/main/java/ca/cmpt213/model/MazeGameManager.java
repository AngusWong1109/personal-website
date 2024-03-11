package ca.cmpt213.model;

import ca.cmpt213.restapi.ApiGameWrapper;

import java.util.ArrayList;
import java.util.List;

/**
 * This class is to manage and store all the maze game that has been built.
 */
public class MazeGameManager {
    public MazeGameManager() {
    }

    private List<MazeGame> mazeGameList = new ArrayList<>();

    public void insertGame (MazeGame game){
        mazeGameList.add(game);
    }

    public MazeGame findGame(int id){
        for(MazeGame game : mazeGameList){
            if(game.getId() == id){
                return game;
            }
        }
        return null;
    }


    public ApiGameWrapper loadDataIntoGameWrapper(int gameId) {
        ApiGameWrapper gameWrapper = new ApiGameWrapper();
        MazeGame game = findGame(gameId);
        if(game == null){
            return null;
        }
        gameWrapper.gameNumber = game.getId();
        gameWrapper.isGameWon = game.hasUserWon();
        gameWrapper.isGameLost = game.hasUserLost();
        gameWrapper.numCheeseGoal = game.getNumberCheeseToCollect();
        gameWrapper.numCheeseFound = game.getNumberCheeseCollected();
        return gameWrapper;
    }
}
