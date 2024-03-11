package ca.cmpt213.controllers;

import ca.cmpt213.model.*;
import ca.cmpt213.restapi.ApiBoardWrapper;
import ca.cmpt213.restapi.ApiGameWrapper;
import ca.cmpt213.restapi.ApiLocationWrapper;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * This class is the controller for the RestAPI and to communicate with SpringBoot
 */
@RestController
public class MazeController {
    private static final MazeGameManager manager = new MazeGameManager();
    private final AtomicInteger nextId = new AtomicInteger();
    private final List<ApiGameWrapper> games = new ArrayList<>();
    private static final int CHEESE_CHEAT = 1;
    @GetMapping("/api/about")
    public String getAuthorName(){
        return "Angus Wong";
    }
    @GetMapping("/api/games")
    public List<ApiGameWrapper> getAllGames(){
        return games;
    }
    @PostMapping("/api/games")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiGameWrapper createNewGame(){
        MazeGame game = new MazeGame();
        game.setId(nextId.incrementAndGet());
        manager.insertGame(game);
        return manager.loadDataIntoGameWrapper(game.getId());
    }

    @GetMapping("/api/games/{id}")
    public ApiGameWrapper findOneGame(@PathVariable("id") int gameId){
        ApiGameWrapper gameWrapper = manager.loadDataIntoGameWrapper(gameId);
        if(gameWrapper == null) {
            throw new NullPointerException();
        }
        return gameWrapper;
    }

    @GetMapping("/api/games/{id}/board")
    public ApiBoardWrapper getGameBoardInfo(@PathVariable("id") int gameId){
        MazeGame game = manager.findGame(gameId);
        if(game == null){
            throw new NullPointerException();
        }
        ApiBoardWrapper boardWrapper = new ApiBoardWrapper();
        boardWrapper.boardHeight = MazeGame.getMazeHeight();
        boardWrapper.boardWidth = MazeGame.getMazeWidth();
        boardWrapper.cheeseLocation = getCheeseLocationFromGame(game);
        boardWrapper.mouseLocation = getMouseLocationFromGame(game);
        boardWrapper.catLocations = getCatsLocationFromGame(game);
        getCellStateFromGame(game, boardWrapper);
        return boardWrapper;
    }

    @PostMapping("/api/games/{id}/moves")
    @ResponseStatus(value = HttpStatus.ACCEPTED)
    public void makeAMove(@PathVariable("id") int gameId,
                          @RequestBody String moves){
        MazeGame game = manager.findGame(gameId);
        MoveDirection direction;
        if(game == null){
            throw new NullPointerException();
        }
        if(invalidMoveInput(moves)){
            throw new IllegalArgumentException();
        }
        direction = assignMoves(moves);
        if(direction == MoveDirection.MOVE_NONE){
            game.doCatMoves();
        }
        else if(!game.isValidPlayerMove(direction)){
            throw new IllegalArgumentException();
        }
        else{
            game.recordPlayerMove(direction);
        }
    }

    @PostMapping("/api/games/{id}/cheatstate")
    @ResponseStatus(value = HttpStatus.ACCEPTED)
    public void doCheat(@PathVariable("id") int gameId,
                        @RequestBody String cheatState){
        MazeGame game = manager.findGame(gameId);
        if(game == null){
            throw new NullPointerException();
        }
        if(cheatState.equals("1_CHEESE")){
            game.setNumberCheeseToCollect(CHEESE_CHEAT);
        }
        else if(cheatState.equals("SHOW_ALL")){
            makeWholeMazeVisible(game);
        }
        else{
            throw new IllegalArgumentException();
        }

    }

    private void makeWholeMazeVisible(MazeGame game) {
        int height = MazeGame.getMazeHeight(), width = MazeGame.getMazeWidth();
        for(int y = 0; y < height; y++){
            for(int x = 0; x < width; x++){
                CellState state = game.getCellState(new CellLocation(x, y));
                state.setVisible(true);
            }
        }
    }

    private MoveDirection assignMoves(String moves) {
        return switch (moves) {
            case "MOVE_UP" -> MoveDirection.MOVE_UP;
            case "MOVE_DOWN" -> MoveDirection.MOVE_DOWN;
            case "MOVE_LEFT" -> MoveDirection.MOVE_LEFT;
            case "MOVE_RIGHT" -> MoveDirection.MOVE_RIGHT;
            default -> MoveDirection.MOVE_NONE;
        };
    }

    private boolean invalidMoveInput(String moves) {
        return !(moves.equals("MOVE_UP") ||
        moves.equals("MOVE_DOWN") ||
        moves.equals("MOVE_LEFT") ||
        moves.equals("MOVE_RIGHT")||
        moves.equals("MOVE_CATS"));
    }

    private void getCellStateFromGame(MazeGame game, ApiBoardWrapper boardWrapper) {
        int height = MazeGame.getMazeHeight(), width = MazeGame.getMazeWidth();
        boolean[][] wall = new boolean[height][width];
        boolean[][] visible = new boolean[height][width];
        for(int y = 0; y < height; y++){
            for(int x = 0; x < width; x++){
                CellState state = game.getCellState(new CellLocation(x, y));
                wall[y][x] = state.isWall();
                visible[y][x] = state.isVisible();
            }
        }
        boardWrapper.isVisible = visible;
        boardWrapper.hasWalls = wall;
    }

    private ApiLocationWrapper getCheeseLocationFromGame(MazeGame game) {
        ApiLocationWrapper cheeseLocation = new ApiLocationWrapper();
        cheeseLocation.x = game.getCheeseLocation().getX();
        cheeseLocation.y = game.getCheeseLocation().getY();
        return cheeseLocation;
    }

    private ApiLocationWrapper getMouseLocationFromGame(MazeGame game) {
        ApiLocationWrapper mouseLocation = new ApiLocationWrapper();
        mouseLocation.x = game.getMouseLocation().getX();
        mouseLocation.y = game.getMouseLocation().getY();
        return mouseLocation;
    }

    private List<ApiLocationWrapper> getCatsLocationFromGame(MazeGame game) {
        List<ApiLocationWrapper> catsLocation = new ArrayList<>();
        Iterator<Cat> itr = game.getCatsIterator();
        while(itr.hasNext()){
            CellLocation location = itr.next().getLocation();
            ApiLocationWrapper catLocation = new ApiLocationWrapper();
            catLocation.x = location.getX();
            catLocation.y = location.getY();
            catsLocation.add(catLocation);
        }
        return catsLocation;
    }

    //Error code: 400 throw IllegalArgumentException
    @ResponseStatus(value = HttpStatus.BAD_REQUEST, reason = "Request ID not found.")
    @ExceptionHandler(IllegalArgumentException.class)
    public void requestItemNotFoundExceptionHandler(){
    }
    //Error Code: 404 throw NullPointerException
    @ResponseStatus(value = HttpStatus.NOT_FOUND, reason = "Request game not exist.")
    @ExceptionHandler(NullPointerException.class)
    public void gameNotExistExceptionHandler(){
    }
}
